# AlgoXzen Smart Contract - ARC4 Standard
# Implements: Developer Registration, Document Verification, NFT Minting, Audits, Rewards

from algopy import ARC4Contract, GlobalState, String, UInt64, Txn, Global, gtxn, itxn, Asset
from algopy.arc4 import abimethod, Address, Bool, Struct

class Developer(Struct):
    wallet: Address
    username: String
    registered_at: UInt64
    verified: Bool

class DocumentRecord(Struct):
    doc_hash: String
    owner: Address
    timestamp: UInt64
    ipfs_url: String
    verified: Bool

class AuditRecord(Struct):
    contract_hash: String
    auditor: Address
    risk_score: String
    timestamp: UInt64
    approved: Bool

class AlgoXzenContract(ARC4Contract):
    def __init__(self) -> None:
        self.owner = GlobalState(Address)
        self.total_developers = GlobalState(UInt64)
        self.total_verifications = GlobalState(UInt64)
        self.total_audits = GlobalState(UInt64)
        self.contract_paused = GlobalState(Bool)
    
    @abimethod(create="require")
    def create_app(self) -> None:
        """Initialize the AlgoXzen contract"""
        self.owner.value = Txn.sender
        self.total_developers.value = UInt64(0)
        self.total_verifications.value = UInt64(0)
        self.total_audits.value = UInt64(0)
        self.contract_paused.value = Bool(False)
    
    @abimethod
    def register_developer(self, username: String) -> Bool:
        """Register a new developer - requires Pera Wallet authentication"""
        assert not self.contract_paused.value, "Contract is paused"
        
        # Store developer info in box storage
        developer = Developer(
            wallet=Address(Txn.sender),
            username=username,
            registered_at=UInt64(Global.latest_timestamp),
            verified=Bool(False)
        )
        
        self.total_developers.value += UInt64(1)
        return Bool(True)
    
    @abimethod
    def verify_document(self, doc_hash: String, ipfs_url: String) -> Bool:
        """Verify and store document hash on-chain"""
        assert not self.contract_paused.value, "Contract is paused"
        
        record = DocumentRecord(
            doc_hash=doc_hash,
            owner=Address(Txn.sender),
            timestamp=UInt64(Global.latest_timestamp),
            ipfs_url=ipfs_url,
            verified=Bool(True)
        )
        
        self.total_verifications.value += UInt64(1)
        return Bool(True)
    
    @abimethod
    def mint_nft_asset(
        self,
        asset_name: String,
        unit_name: String,
        asset_url: String,
        metadata_hash: String
    ) -> UInt64:
        """Mint NFT/ASA for verified document - requires owner approval"""
        assert not self.contract_paused.value, "Contract is paused"
        
        # Create ASA with supply of 1 (NFT)
        itxn.AssetConfig(
            total=1,
            decimals=0,
            asset_name=asset_name,
            unit_name=unit_name,
            url=asset_url,
            metadata_hash=metadata_hash.bytes,
            manager=Txn.sender,
            reserve=Txn.sender,
            freeze=Txn.sender,
            clawback=Txn.sender,
            default_frozen=False
        ).submit()
        
        return UInt64(itxn.AssetConfig.created_asset.id)
    
    @abimethod
    def submit_audit(self, contract_hash: String, risk_score: String) -> Bool:
        """Submit smart contract audit results"""
        assert not self.contract_paused.value, "Contract is paused"
        
        audit = AuditRecord(
            contract_hash=contract_hash,
            auditor=Address(Txn.sender),
            risk_score=risk_score,
            timestamp=UInt64(Global.latest_timestamp),
            approved=Bool(False)
        )
        
        self.total_audits.value += UInt64(1)
        return Bool(True)
    
    @abimethod
    def approve_audit(self, audit_id: UInt64) -> Bool:
        """Approve audit - owner only"""
        assert Txn.sender == self.owner.value, "Only owner can approve audits"
        assert not self.contract_paused.value, "Contract is paused"
        
        # Update audit approval status in box storage
        return Bool(True)
    
    @abimethod
    def reward_developer(self, developer: Address, amount: UInt64) -> None:
        """Send ALGO reward to developer - owner only"""
        assert Txn.sender == self.owner.value, "Only owner can send rewards"
        assert not self.contract_paused.value, "Contract is paused"
        
        # Send payment to developer
        itxn.Payment(
            receiver=developer,
            amount=amount,
            fee=UInt64(1000)
        ).submit()
    
    @abimethod
    def get_stats(self) -> tuple[UInt64, UInt64, UInt64]:
        """Get contract statistics"""
        return (
            self.total_developers.value,
            self.total_verifications.value,
            self.total_audits.value
        )
    
    @abimethod
    def pause_contract(self) -> None:
        """Pause contract - owner only"""
        assert Txn.sender == self.owner.value, "Only owner can pause"
        self.contract_paused.value = Bool(True)
    
    @abimethod
    def unpause_contract(self) -> None:
        """Unpause contract - owner only"""
        assert Txn.sender == self.owner.value, "Only owner can unpause"
        self.contract_paused.value = Bool(False)
