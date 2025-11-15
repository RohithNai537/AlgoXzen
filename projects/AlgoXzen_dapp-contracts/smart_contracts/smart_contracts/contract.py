from algopy import ARC4Contract, Account, Txn, String, UInt64, itxn
import algopy.arc4 as arc4


class SmartContracts(ARC4Contract):
    
    # State variables
    owner: Account
    last_hash: String
    last_title: String
    last_desc: String

    # -----------------------------------------------------
    # INIT METHOD (Called once after deploy)
    # -----------------------------------------------------
    @arc4.abimethod
    def init_app(self) -> None:
        self.owner = Txn.sender
        self.last_hash = String("")
        self.last_title = String("")
        
        self.last_desc = String("")

    # -----------------------------------------------------
    # MAIN METHOD - VERIFY & PAY
    # -----------------------------------------------------
    @arc4.abimethod
    def verify_and_pay(self, file_hash: String, title: String, description: String) -> String:
        # Platform fee: 0.2 ALGO
        PLATFORM_FEE = UInt64(200_000)

        assert Txn.amount >= PLATFORM_FEE, "INSUFFICIENT_FEE"

        self.last_hash = file_hash
        self.last_title = title
        self.last_desc = description

        # Payment via Inner Transaction
        itxn.Payment(
            receiver=self.owner,
            amount=Txn.amount,
        ).submit()

        return String("Verification successful.")

    # -----------------------------------------------------
    # GETTER
    # -----------------------------------------------------
    @arc4.abimethod
    def get_last(self) -> String:
        return (
            String("Hash: ") + self.last_hash +
            String(" | Title: ") + self.last_title +
            String(" | Desc: ") + self.last_desc
        )
