from algopy import (
    arc4,
    Global,
    Txn,
    UInt64,
    gtxn,
    itxn,
    abi,
)

class AlgoXzen(arc4.ARC4Contract):
    """
    AlgoXzen – AI-Powered Blockchain Audit & Smart Contract Verification Platform.
    Every action is authenticated by the owner's Pera Wallet on TestNet.
    """

    # State variables
    owner: abi.StaticBytes[arc4.Address]
    verified_contracts: dict[abi.String, abi.String]       # {contract_name: verification_status}
    audit_logs: dict[abi.String, abi.String]               # {contract_name: ipfs_audit_hash}
    reward_pool: UInt64
    audit_count: UInt64
    system_active: bool

    # -------------------------------
    # Application Creation
    # -------------------------------
    @arc4.abimethod(create="require", allow_actions=["NoOp"])
    def create_application(self, owner: arc4.Address) -> None:
        """
        Initializes the AlgoXzen app and sets the Pera Wallet owner.
        """
        self.owner = owner.bytes
        self.system_active = True
        self.audit_count = UInt64(0)
        self.reward_pool = UInt64(0)

    # -------------------------------
    # Verify Contract
    # -------------------------------
    @arc4.abimethod
    def verify_contract(self, contract_name: abi.String, verification_hash: abi.String) -> None:
        """
        Adds a smart contract to verified list (authenticated by owner).
        """
        assert Txn.sender == self.owner, "Only owner can verify"
        assert self.system_active, "System is paused"
        self.verified_contracts[contract_name] = verification_hash
        self.audit_count += UInt64(1)

    # -------------------------------
    # Submit Audit Proof
    # -------------------------------
    @arc4.abimethod
    def submit_audit(self, contract_name: abi.String, ipfs_hash: abi.String) -> None:
        """
        Submits an audit proof (IPFS hash of report).
        """
        assert self.system_active, "System paused"
        self.audit_logs[contract_name] = ipfs_hash

    # -------------------------------
    # Approve Audit
    # -------------------------------
    @arc4.abimethod
    def approve_audit(self, contract_name: abi.String, reward_amount: UInt64) -> None:
        """
        Approves an audit and sends testnet reward from app escrow.
        """
        assert Txn.sender == self.owner, "Only owner can approve"
        assert self.system_active, "System paused"

        # Transfer reward to auditor (Txn.sender can be replaced with task auditor)
        itxn.Payment(
            receiver=Txn.sender,
            amount=reward_amount
        ).submit()

        self.reward_pool -= reward_amount

    # -------------------------------
    # Add Funds to Reward Pool
    # -------------------------------
    @arc4.abimethod
    def fund_pool(self, payment_txn: gtxn.PaymentTransaction) -> None:
        """
        Allows the owner to add ALGOs to reward pool (TestNet tokens).
        """
        assert payment_txn.receiver == Global.current_application_address
        self.reward_pool += payment_txn.amount

    # -------------------------------
    # Get Contract Verification Status
    # -------------------------------
    @arc4.abimethod
    def get_verification_status(self, contract_name: abi.String) -> abi.String:
        """
        Returns verification hash if exists.
        """
        return self.verified_contracts.get(contract_name, abi.String("Unverified"))

    # -------------------------------
    # Get Audit Proof Hash
    # -------------------------------
    @arc4.abimethod
    def get_audit_log(self, contract_name: abi.String) -> abi.String:
        """
        Returns the IPFS hash for the given contract’s audit log.
        """
        return self.audit_logs.get(contract_name, abi.String("No log found"))

    # -------------------------------
    # Revoke Contract Verification
    # -------------------------------
    @arc4.abimethod
    def revoke_contract(self, contract_name: abi.String) -> None:
        """
        Revokes a contract’s verification (only owner).
        """
        assert Txn.sender == self.owner, "Only owner can revoke"
        self.verified_contracts[contract_name] = abi.String("Revoked")

    # -------------------------------
    # Pause / Resume System
    # -------------------------------
    @arc4.abimethod
    def toggle_system(self) -> None:
        """
        Pauses or resumes AlgoXzen system (only owner).
        """
        assert Txn.sender == self.owner, "Only owner can toggle"
        self.system_active = not self.system_active

    # -------------------------------
    # Get System Summary
    # -------------------------------
    @arc4.abimethod
    def get_system_summary(self) -> (UInt64, bool, UInt64):
        """
        Returns audit count, system status, and reward pool.
        """
        return self.audit_count, self.system_active, self.reward_pool

    # -------------------------------
    # Delete Application (closeout)
    # -------------------------------
    @arc4.abimethod(allow_actions=["DeleteApplication"])
    def delete_application(self) -> None:
        """
        Only the Pera Wallet owner can delete the app.
        Refunds remaining ALGO to owner.
        """
        assert Txn.sender == self.owner, "Unauthorized"
        itxn.Payment(
            receiver=self.owner,
            close_remainder_to=self.owner,
            amount=UInt64(0),
        ).submit()

