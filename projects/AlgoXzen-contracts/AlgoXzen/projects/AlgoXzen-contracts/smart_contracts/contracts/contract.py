from beaker import Application, GlobalStateValue, create, external
import pyteal as pt

class Counter(Application):
    """A simple counter application"""
    counter = GlobalStateValue(
        stack_type=pt.TealType.uint64,
        default=pt.Int(0),
        descr="Simple counter"
    )

    @create
    def create(self):
        """Called on application creation"""
        return self.counter.set_default()

    @external
    def increment(self, *, output: pt.abi.Uint64):
        """Increment the counter by 1"""
        return pt.Seq(
            self.counter.set(self.counter.get() + pt.Int(1)),
            output.set(self.counter.get())
        )

    @external(read_only=True)
    def value(self, *, output: pt.abi.Uint64):
        """Get the current counter value"""
        return output.set(self.counter.get())

if _name_ == "_main_":
    import os
    if not os.path.exists("artifacts"):
        os.makedirs("artifacts")
    Counter().dump("artifacts")

class AlgoXzenApp(Application):
    """AlgoXzen Smart Contract for Document Verification and NFT Management"""
    
    # Global state
    creator: Final[GlobalStateValue] = GlobalStateValue(
        stack_type=TealType.bytes,
        key=Bytes("creator"),
    )
    
    document_counter: Final[GlobalStateValue] = GlobalStateValue(
        stack_type=TealType.uint64,
        key=Bytes("doc_counter"),
        default=Int(0),
    )
    
    # Dynamic state
    document_hash = DynamicApplicationStateValue(
        stack_type=TealType.bytes,
        key=Bytes("doc_hash"),
        max_keys=100,
    )
    
    document_owner = DynamicApplicationStateValue(
        stack_type=TealType.bytes,
        key=Bytes("doc_owner"),
        max_keys=100,
    )
    
    document_metadata = DynamicApplicationStateValue(
        stack_type=TealType.bytes,
        key=Bytes("doc_meta"),
        max_keys=100,
    )
    
    document_status = DynamicApplicationStateValue(
        stack_type=TealType.bytes,
        key=Bytes("doc_status"),
        max_keys=100,
    )
    
    user_role = DynamicApplicationStateValue(
        stack_type=TealType.bytes,
        key=Bytes("role"),
        max_keys=1000,
    )
    
    nft_asset_id = DynamicApplicationStateValue(
        stack_type=TealType.uint64,
        key=Bytes("nft_id"),
        max_keys=100,
    )
    
    nft_price = DynamicApplicationStateValue(
        stack_type=TealType.uint64,
        key=Bytes("nft_price"),
        max_keys=100,
    )
    
    audit_reports = DynamicApplicationStateValue(
        stack_type=TealType.bytes,
        key=Bytes("audit"),
        max_keys=1000,
    )
    
    @create
    def create(self):
        """Initialize application state"""
        return Seq([
            self.creator.set(Txn.sender()),
            self.document_counter.set(Int(0)),
        ])
    
    @external
    def store_document(self, document_id: abi.Uint64, doc_hash: abi.String, metadata: abi.String, *, output: abi.Uint64):
        """Store document hash and metadata"""
        return Seq([
            Assert(Txn.sender() == self.creator.get()),
            self.document_hash[document_id.get()].set(doc_hash.get()),
            self.document_owner[document_id.get()].set(Txn.sender()),
            self.document_metadata[document_id.get()].set(metadata.get()),
            self.document_status[document_id.get()].set(Bytes("active")),
            self.document_counter.set(self.document_counter.get() + Int(1)),
            output.set(document_id.get()),
        ])
    
    @external
    def create_nft(
        self, 
        document_id: abi.Uint64, 
        name: abi.String, 
        symbol: abi.String,
        url: abi.String,
        *,
        output: abi.Uint64
    ):
        """Create NFT for a document"""
        return Seq([
            Assert(Txn.sender() == self.document_owner[document_id.get()].get()),
            InnerTxn.execute_asset_config(
                config_asset=Int(0),
                config_asset_name=name.get(),
                config_asset_unit_name=symbol.get(),
                config_asset_url=url.get(),
                config_asset_total=Int(1),
                config_asset_decimals=Int(0),
                config_asset_default_frozen=Int(0),
                config_asset_manager=Global.current_application_address(),
                config_asset_reserve=Global.current_application_address(),
                config_asset_freeze=Global.current_application_address(),
                config_asset_clawback=Global.current_application_address(),
            ),
            self.nft_asset_id[document_id.get()].set(InnerTxn.created_asset_id()),
            output.set(InnerTxn.created_asset_id()),
        ])
    
    @external(authorize=Authorize.only(Global.creator_address()))
    def set_user_role(self, address: abi.Address, role: abi.String, *, output: abi.Bool):
        """Assign role to user"""
        return Seq([
            self.user_role[address.get()].set(role.get()),
            output.set(Int(1)),
        ])
    
    @external
    def list_nft_for_sale(self, document_id: abi.Uint64, price: abi.Uint64, *, output: abi.Bool):
        """List NFT for sale"""
        return Seq([
            Assert(Txn.sender() == self.document_owner[document_id.get()].get()),
            self.nft_price[document_id.get()].set(price.get()),
            output.set(Int(1)),
        ])
    
    @external
    def buy_nft(self, document_id: abi.Uint64, *, output: abi.Bool):
        """Buy listed NFT"""
        nft_id = self.nft_asset_id[document_id.get()].get()
        price = self.nft_price[document_id.get()].get()
        seller = self.document_owner[document_id.get()].get()
        
        return Seq([
            Assert(price > Int(0)),
            Assert(Txn.amount() >= price),
            # Transfer payment to seller
            InnerTxn.execute_payment(
                amount=price,
                receiver=seller,
            ),
            # Transfer NFT to buyer
            InnerTxn.execute_asset_transfer(
                xfer_asset=nft_id,
                asset_amount=Int(1),
                asset_receiver=Txn.sender(),
            ),
            self.document_owner[document_id.get()].set(Txn.sender()),
            self.nft_price[document_id.get()].set(Int(0)),
            output.set(Int(1)),
        ])
    
    @external
    def submit_audit(
        self,
        document_id: abi.Uint64,
        audit_hash: abi.String,
        severity: abi.String,
        *,
        output: abi.Bool
    ):
        """Submit audit report"""
        return Seq([
            Assert(Or(
                Txn.sender() == self.creator.get(),
                self.user_role[Txn.sender()].get() == Bytes("AUDITOR")
            )),
            self.audit_reports[document_id.get()].set(
                Concat(
                    audit_hash.get(),
                    Bytes("|"),
                    severity.get(),
                    Bytes("|"),
                    Itob(Global.latest_timestamp()),
                )
            ),
            output.set(Int(1)),
        ])


class NFTMarketplaceApp(Application):
    """Base contract for AlgoXzen platform with shared utilities."""

    # Application state keys
    CREATOR_KEY = Bytes("creator")
    DOCUMENT_COUNTER = Bytes("doc_counter")
    DOCUMENT_HASH = Bytes("doc_hash_")
    DOCUMENT_OWNER = Bytes("doc_owner_")
    DOCUMENT_METADATA = Bytes("doc_meta_")

    def _init_(self):
        super()._init_()
        self.initialize_contract_state()

    def initialize_contract_state(self):
        """Initialize contract state on creation."""
        return Seq(
            [
                App.globalPut(self.CREATOR_KEY, Global.creator_address()),
                App.globalPut(self.DOCUMENT_COUNTER, Int(0)),
            ]
        )

    @abimethod()
    def verify_caller(self, *, output: Bool) -> Bool:
        """Verify if the transaction sender is the contract creator."""
        return Txn.sender() == App.globalGet(self.CREATOR_KEY)

    @abimethod()
    def store_document_hash(
        self, doc_id: Int, doc_hash: Bytes, metadata: String, *, output: Bool
    ) -> Bool:
        """Store document hash and metadata on chain."""
        return Seq(
            [
                Assert(self.verify_caller()),
                App.globalPut(self.DOCUMENT_HASH + Bytes(doc_id), doc_hash),
                App.globalPut(self.DOCUMENT_OWNER + Bytes(doc_id), Txn.sender()),
                App.globalPut(self.DOCUMENT_METADATA + Bytes(doc_id), metadata),
                App.globalPut(
                    self.DOCUMENT_COUNTER, App.globalGet(self.DOCUMENT_COUNTER) + Int(1)
                ),
                Int(1),
            ]
        )

    @abimethod()
    def verify_document(self, doc_id: Int, doc_hash: Bytes, *, output: Bool) -> Bool:
        """Verify if a document hash matches the stored hash."""
        stored_hash = App.globalGet(self.DOCUMENT_HASH + Bytes(doc_id))
        return stored_hash == doc_hash

    @abimethod()
    def get_document_owner(self, doc_id: Int, *, output: Address) -> Address:
        """Get the owner of a document."""
        return App.globalGet(self.DOCUMENT_OWNER + Bytes(doc_id))

    @abimethod()
    def get_document_metadata(self, doc_id: Int, *, output: String) -> String:
        """Get document metadata."""
        return App.globalGet(self.DOCUMENT_METADATA + Bytes(doc_id))

    @abimethod()
    def get_document_count(self, *, output: Int) -> Int:
        """Get total number of documents stored."""
        return App.globalGet(self.DOCUMENT_COUNTER)


class DocumentVerificationContract(AlgoXzenBase):
    """Smart contract for document/media verification and NFT creation."""
    
    # Additional state keys for NFT functionality
    NFT_ASSET_ID = Bytes("nft_asset_id_")
    NFT_METADATA = Bytes("nft_metadata_")
    DOCUMENT_STATUS = Bytes("doc_status_")
    
    @abimethod()
    def create_document_nft(
        self, 
        doc_id: Int, 
        name: String, 
        unit_name: String, 
        total_supply: Int,
        metadata_url: String,
        *, 
        output: Int
    ) -> Int:
        """Create an NFT for a document with metadata."""
        return Seq([
            Assert(self.verify_caller()),
            Assert(App.globalGet(self.DOCUMENT_HASH + Bytes(doc_id)) != Bytes("")),
            InnerTxnBuilder.Begin(),
            InnerTxnBuilder.SetFields({
                TxnField.type_enum: TxnType.AssetConfig,
                TxnField.config_asset_name: name,
                TxnField.config_asset_unit_name: unit_name,
                TxnField.config_asset_total: total_supply,
                TxnField.config_asset_url: metadata_url,
                TxnField.config_asset_manager: Global.current_application_address(),
                TxnField.config_asset_reserve: Global.current_application_address(),
                TxnField.config_asset_freeze: Global.current_application_address(),
                TxnField.config_asset_clawback: Global.current_application_address(),
            }),
            InnerTxnBuilder.Submit(),
            App.globalPut(self.NFT_ASSET_ID + Bytes(doc_id), InnerTxnBuilder.Created_Asset_ID()),
            App.globalPut(self.NFT_METADATA + Bytes(doc_id), metadata_url),
            InnerTxnBuilder.Created_Asset_ID(),
        ])
    
    @abimethod()
    def transfer_document_nft(
        self, 
        doc_id: Int, 
        receiver: Address,
        *, 
        output: Bool
    ) -> Bool:
        """Transfer document NFT to a new owner."""
        asset_id = App.globalGet(self.NFT_ASSET_ID + Bytes(doc_id))
        return Seq([
            Assert(self.verify_caller()),
            InnerTxnBuilder.Begin(),
            InnerTxnBuilder.SetFields({
                TxnField.type_enum: TxnType.AssetTransfer,
                TxnField.xfer_asset: asset_id,
                TxnField.asset_amount: Int(1),
                TxnField.asset_receiver: receiver,
            }),
            InnerTxnBuilder.Submit(),
            App.globalPut(self.DOCUMENT_OWNER + Bytes(doc_id), receiver),
            Int(1),
        ])
    
    @abimethod()
    def update_document_status(
        self, 
        doc_id: Int, 
        status: String,
        *, 
        output: Bool
    ) -> Bool:
        """Update the status of a document (e.g., 'verified', 'revoked')."""
        return Seq([
            Assert(self.verify_caller()),
            App.globalPut(self.DOCUMENT_STATUS + Bytes(doc_id), status),
            Int(1),
        ])
    
    @abimethod()
    def get_document_status(
        self, 
        doc_id: Int,
        *, 
        output: String
    ) -> String:
        """Get the current status of a document."""
        return App.globalGet(self.DOCUMENT_STATUS + Bytes(doc_id))
    
    @abimethod()
    def get_nft_info(
        self, 
        doc_id: Int,
        *, 
        output: Tuple[Int, String]
    ) -> Tuple[Int, String]:
        """Get NFT ID and metadata URL for a document."""
        return App.globalGet(self.NFT_ASSET_ID + Bytes(doc_id)), App.globalGet(self.NFT_METADATA + Bytes(doc_id))


class AccessControlContract(AlgoXzenBase):
    """Smart contract for managing access control and permissions."""
    
    # Access control state keys
    ROLE_ADMIN = Bytes("ADMIN")
    ROLE_EDITOR = Bytes("EDITOR")
    ROLE_VIEWER = Bytes("VIEWER")
    USER_ROLE = Bytes("user_role_")
    DOC_PERMISSIONS = Bytes("doc_perms_")
    SHARED_ACCESS = Bytes("shared_access_")
    
    def initialize_contract_state(self):
        """Initialize contract state with admin role for creator."""
        return Seq([
            super().initialize_contract_state(),
            App.globalPut(self.USER_ROLE + Global.creator_address(), self.ROLE_ADMIN),
        ])
    
    @abimethod()
    def assign_role(
        self,
        user: Address,
        role: String,
        *,
        output: Bool
    ) -> Bool:
        """Assign a role to a user (ADMIN, EDITOR, VIEWER)."""
        return Seq([
            Assert(self.verify_caller()),  # Only admin can assign roles
            Assert(
                If(
                    role == self.ROLE_ADMIN,
                    self.verify_caller(),  # Only current admin can create new admins
                    Int(1)
                )
            ),
            App.globalPut(self.USER_ROLE + user, role),
            Int(1)
        ])
    
    @abimethod()
    def get_user_role(
        self,
        user: Address,
        *,
        output: String
    ) -> String:
        """Get the role assigned to a user."""
        return App.globalGet(self.USER_ROLE + user)
    
    @abimethod()
    def set_document_permissions(
        self,
        doc_id: Int,
        min_role: String,
        *,
        output: Bool
    ) -> Bool:
        """Set minimum role required to access a document."""
        return Seq([
            Assert(
                Or(
                    self.verify_caller(),
                    App.globalGet(self.USER_ROLE + Txn.sender()) == self.ROLE_ADMIN
                )
            ),
            App.globalPut(self.DOC_PERMISSIONS + Bytes(doc_id), min_role),
            Int(1)
        ])
    
    @abimethod()
    def check_access(
        self,
        user: Address,
        doc_id: Int,
        *,
        output: Bool
    ) -> Bool:
        """Check if a user has access to a document based on their role."""
        user_role = App.globalGet(self.USER_ROLE + user)
        min_role = App.globalGet(self.DOC_PERMISSIONS + Bytes(doc_id))
        return Or(
            user_role == self.ROLE_ADMIN,
            user_role == min_role,
            And(
                user_role == self.ROLE_EDITOR,
                min_role == self.ROLE_VIEWER
            ),
            App.globalGet(self.SHARED_ACCESS + Bytes(doc_id) + user) == Int(1)
        )
    
    @abimethod()
    def share_document(
        self,
        doc_id: Int,
        shared_with: Address,
        *,
        output: Bool
    ) -> Bool:
        """Share a document with a specific user."""
        return Seq([
            Assert(
                Or(
                    self.verify_caller(),
                    self.check_access(Txn.sender(), doc_id)
                )
            ),
            App.globalPut(self.SHARED_ACCESS + Bytes(doc_id) + shared_with, Int(1)),
            Int(1)
        ])
    
    @abimethod()
    def revoke_access(
        self,
        doc_id: Int,
        user: Address,
        *,
        output: Bool
    ) -> Bool:
        """Revoke a user's access to a document."""
        return Seq([
            Assert(
                Or(
                    self.verify_caller(),
                    self.check_access(Txn.sender(), doc_id)
                )
            ),
            App.globalPut(self.SHARED_ACCESS + Bytes(doc_id) + user, Int(0)),
            Int(1)
        ])
    
    @abimethod()
    def is_admin(
        self,
        user: Address,
        *,
        output: Bool
    ) -> Bool:
        """Check if a user has admin role."""
        return App.globalGet(self.USER_ROLE + user) == self.ROLE_ADMIN


class NFTMarketplaceContract(AlgoXzenBase):
    """Smart contract for NFT marketplace operations."""
    
    # Marketplace state keys
    LISTING_PRICE = Bytes(b"listing_price_")
    LISTING_SELLER = Bytes(b"listing_seller_")
    LISTING_STATUS = Bytes(b"listing_status_")
    LICENSE_PRICE = Bytes(b"license_price_")
    LICENSE_DURATION = Bytes(b"license_duration_")
    LICENSE_HOLDER = Bytes(b"license_holder_")
    LICENSE_EXPIRY = Bytes(b"license_expiry_")
    
    def check_document_owner(self, doc_id: Int, address: Address) -> Bool:
        """Helper to check if an address owns a document."""
        doc_owner = self.get_document_owner(doc_id, output=True)
        return doc_owner == address

    @abimethod()
    def list_nft_for_sale(
        self,
        doc_id: Int,
        price: Int,
        *,
        output: Bool
    ) -> Bool:
        """List an NFT for sale."""
        return Seq([
            Assert(self.check_document_owner(doc_id, Global.caller_address())),
            App.globalPut(self.LISTING_PRICE + Bytes(str(doc_id).encode()), price),
            App.globalPut(self.LISTING_SELLER + Bytes(str(doc_id).encode()), Global.caller_address()),
            App.globalPut(self.LISTING_STATUS + Bytes(str(doc_id).encode()), Bytes(b"active")),
            Int(1)
        ])
    
    @abimethod()
    def buy_nft(
        self,
        doc_id: Int,
        *,
        output: Bool
    ) -> Bool:
        """Buy a listed NFT."""
        doc_id_bytes = Bytes(str(doc_id).encode())
        price = App.globalGet(self.LISTING_PRICE + doc_id_bytes)
        seller = App.globalGet(self.LISTING_SELLER + doc_id_bytes)
        return Seq([
            Assert(App.globalGet(self.LISTING_STATUS + doc_id_bytes) == Bytes(b"active")),
            Assert(Txn.amount >= price),
            InnerTxnBuilder.Begin(),
            InnerTxnBuilder.SetFields({
                TxnField.type_enum: TxnType.Payment,
                TxnField.amount: price,
                TxnField.receiver: seller,
            }),
            InnerTxnBuilder.Submit(),
            self.transfer_document_nft(doc_id, Global.caller_address(), output=True),
            App.globalPut(self.LISTING_STATUS + doc_id_bytes, Bytes(b"sold")),
            Int(1)
        ])
    
    @abimethod()
    def set_license_terms(
        self,
        doc_id: Int,
        price: Int,
        duration: Int,
        *,
        output: Bool
    ) -> Bool:
        """Set licensing terms for a document."""
        doc_id_bytes = Bytes(str(doc_id).encode())
        return Seq([
            Assert(self.check_document_owner(doc_id, Global.caller_address())),
            App.globalPut(self.LICENSE_PRICE + doc_id_bytes, price),
            App.globalPut(self.LICENSE_DURATION + doc_id_bytes, duration),
            Int(1)
        ])
    
    @abimethod()
    def purchase_license(
        self,
        doc_id: Int,
        *,
        output: Bool
    ) -> Bool:
        """Purchase a license for a document."""
        doc_id_bytes = Bytes(str(doc_id).encode())
        price = App.globalGet(self.LICENSE_PRICE + doc_id_bytes)
        duration = App.globalGet(self.LICENSE_DURATION + doc_id_bytes)
        owner = self.get_document_owner(doc_id, output=True)
        caller = Global.caller_address()
        return Seq([
            Assert(price > Int(0)),
            Assert(Txn.amount >= price),
            InnerTxnBuilder.Begin(),
            InnerTxnBuilder.SetFields({
                TxnField.type_enum: TxnType.Payment,
                TxnField.amount: price,
                TxnField.receiver: owner,
            }),
            InnerTxnBuilder.Submit(),
            App.globalPut(self.LICENSE_HOLDER + doc_id_bytes + caller, Int(1)),
            App.globalPut(
                self.LICENSE_EXPIRY + doc_id_bytes + caller,
                Global.latest_timestamp() + duration
            ),
            Int(1)
        ])
    
    @abimethod()
    def check_license(
        self,
        doc_id: Int,
        user: Address,
        *,
        output: Bool
    ) -> Bool:
        """Check if a user has a valid license for a document."""
        doc_id_bytes = Bytes(str(doc_id).encode())
        has_license = App.globalGet(self.LICENSE_HOLDER + doc_id_bytes + user)
        expiry = App.globalGet(self.LICENSE_EXPIRY + doc_id_bytes + user)
        return And(
            has_license == Int(1),
            Global.latest_timestamp() <= expiry
        )
    
    @abimethod()
    def revoke_license(
        self,
        doc_id: Int,
        user: Address,
        *,
        output: Bool
    ) -> Bool:
        """Revoke a user's license (only document owner)."""
        doc_id_bytes = Bytes(str(doc_id).encode())
        return Seq([
            Assert(self.check_document_owner(doc_id, Global.caller_address())),
            App.globalPut(self.LICENSE_HOLDER + doc_id_bytes + user, Int(0)),
            Int(1)
        ])


class AuditContract(AlgoXzenBase):
    """Smart contract for managing audit reports and vulnerability assessments."""
    
    # Audit state keys
    AUDIT_COUNTER = Bytes(b"audit_counter")
    AUDIT_REPORT = Bytes(b"audit_report_")
    AUDIT_SEVERITY = Bytes(b"audit_severity_")
    AUDIT_STATUS = Bytes(b"audit_status_")
    AUDIT_TIMESTAMP = Bytes(b"audit_timestamp_")
    AUDIT_AUDITOR = Bytes(b"audit_auditor_")
    VULNERABILITY_COUNT = Bytes(b"vuln_count_")
    
    def initialize_contract_state(self):
        """Initialize contract state with audit counter."""
        return Seq([
            super().initialize_contract_state(),
            App.globalPut(self.AUDIT_COUNTER, Int(0))
        ])
    
    @abimethod()
    def submit_audit_report(
        self,
        doc_id: Int,
        report_hash: Bytes,
        severity: String,
        vuln_count: Int,
        *,
        output: Int
    ) -> Int:
        """Submit a new audit report."""
        audit_id = App.globalGet(self.AUDIT_COUNTER)
        audit_id_bytes = Bytes(str(audit_id).encode())
        doc_id_bytes = Bytes(str(doc_id).encode())
        return Seq([
            Assert(Or(
                self.verify_caller(),
                App.globalGet(self.USER_ROLE + Global.caller_address()) == self.ROLE_ADMIN
            )),
            App.globalPut(self.AUDIT_REPORT + audit_id_bytes, report_hash),
            App.globalPut(self.AUDIT_SEVERITY + audit_id_bytes, severity),
            App.globalPut(self.AUDIT_STATUS + audit_id_bytes, Bytes(b"pending")),
            App.globalPut(self.AUDIT_TIMESTAMP + audit_id_bytes, Global.latest_timestamp()),
            App.globalPut(self.AUDIT_AUDITOR + audit_id_bytes, Global.caller_address()),
            App.globalPut(self.VULNERABILITY_COUNT + doc_id_bytes, vuln_count),
            App.globalPut(self.AUDIT_COUNTER, audit_id + Int(1)),
            audit_id
        ])
    
    @abimethod()
    def update_audit_status(
        self,
        audit_id: Int,
        status: String,
        *,
        output: Bool
    ) -> Bool:
        """Update the status of an audit report."""
        audit_id_bytes = Bytes(str(audit_id).encode())
        return Seq([
            Assert(Or(
                self.verify_caller(),
                Global.caller_address() == App.globalGet(self.AUDIT_AUDITOR + audit_id_bytes)
            )),
            App.globalPut(self.AUDIT_STATUS + audit_id_bytes, status),
            Int(1)
        ])
    
    @abimethod()
    def get_audit_report(
        self,
        audit_id: Int,
        *,
        output: Tuple[Bytes, String, String, Int, Address]
    ) -> Tuple[Bytes, String, String, Int, Address]:
        """Get audit report details."""
        audit_id_bytes = Bytes(str(audit_id).encode())
        return (
            App.globalGet(self.AUDIT_REPORT + audit_id_bytes),
            App.globalGet(self.AUDIT_SEVERITY + audit_id_bytes),
            App.globalGet(self.AUDIT_STATUS + audit_id_bytes),
            App.globalGet(self.AUDIT_TIMESTAMP + audit_id_bytes),
            App.globalGet(self.AUDIT_AUDITOR + audit_id_bytes)
        )
    
    @abimethod()
    def get_vulnerability_count(
        self,
        doc_id: Int,
        *,
        output: Int
    ) -> Int:
        """Get the number of vulnerabilities found in a document."""
        return App.globalGet(self.VULNERABILITY_COUNT + Bytes(str(doc_id).encode()))
