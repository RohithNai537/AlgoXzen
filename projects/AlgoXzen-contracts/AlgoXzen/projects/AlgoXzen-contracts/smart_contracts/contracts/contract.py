from beaker import *
import pyteal as pt

class AlgoXzenApp(Application):
    """Simplified AlgoXzen Smart Contract with 10 core methods"""
    
    creator = GlobalStateValue(pt.TealType.bytes)
    doc_counter = GlobalStateValue(pt.TealType.uint64, default=pt.Int(0))

    document_hash = DynamicApplicationStateValue(pt.TealType.bytes, max_keys=100)
    document_owner = DynamicApplicationStateValue(pt.TealType.bytes, max_keys=100)
    audit_status = DynamicApplicationStateValue(pt.TealType.bytes, max_keys=100)
    nft_asset = DynamicApplicationStateValue(pt.TealType.uint64, max_keys=100)
    debug_notes = DynamicApplicationStateValue(pt.TealType.bytes, max_keys=50)

    @create
    def create_app(self):
        """Initialize global state"""
        return pt.Seq([
            self.creator.set(pt.Txn.sender()),
            self.doc_counter.set(pt.Int(0)),
        ])

    @external
    def store_document(self, doc_id: pt.abi.Uint64, doc_hash: pt.abi.String, *, output: pt.abi.Uint64):
        """Store new document"""
        return pt.Seq([
            self.document_hash[doc_id.get()].set(doc_hash.get()),
            self.document_owner[doc_id.get()].set(pt.Txn.sender()),
            self.doc_counter.set(self.doc_counter.get() + pt.Int(1)),
            output.set(doc_id.get())
        ])


    @external(read_only=True)
    def verify_document(self, doc_id: pt.abi.Uint64, doc_hash: pt.abi.String, *, output: pt.abi.Bool):
        """Check if stored hash matches"""
        return output.set(self.document_hash[doc_id.get()] == doc_hash.get())


    @external
    def create_nft(self, doc_id: pt.abi.Uint64, name: pt.abi.String, *, output: pt.abi.Uint64):
        """Create NFT for document"""
        return pt.Seq([
            pt.Assert(pt.Txn.sender() == self.document_owner[doc_id.get()]),
            pt.InnerTxnBuilder.Begin(),
            pt.InnerTxnBuilder.SetFields({
                pt.TxnField.type_enum: pt.TxnType.AssetConfig,
                pt.TxnField.config_asset_name: name.get(),
                pt.TxnField.config_asset_total: pt.Int(1),
                pt.TxnField.config_asset_decimals: pt.Int(0),
                pt.TxnField.config_asset_manager: pt.Global.current_application_address(),
            }),
            pt.InnerTxnBuilder.Submit(),
            self.nft_asset[doc_id.get()].set(pt.InnerTxn.created_asset_id()),
            output.set(pt.InnerTxn.created_asset_id()),
        ])

   
    @external
    def transfer_nft(self, doc_id: pt.abi.Uint64, receiver: pt.abi.Address, *, output: pt.abi.Bool):
        """Send NFT to another address"""
        asset_id = self.nft_asset[doc_id.get()].get()
        return pt.Seq([
            pt.Assert(pt.Txn.sender() == self.document_owner[doc_id.get()]),
            pt.InnerTxnBuilder.Begin(),
            pt.InnerTxnBuilder.SetFields({
                pt.TxnField.type_enum: pt.TxnType.AssetTransfer,
                pt.TxnField.xfer_asset: asset_id,
                pt.TxnField.asset_amount: pt.Int(1),
                pt.TxnField.asset_receiver: receiver.get(),
            }),
            pt.InnerTxnBuilder.Submit(),
            self.document_owner[doc_id.get()].set(receiver.get()),
            output.set(pt.Int(1))
        ])


    @external
    def submit_audit(self, doc_id: pt.abi.Uint64, report_hash: pt.abi.String, *, output: pt.abi.Bool):
        """Submit audit report hash"""
        return pt.Seq([
            self.audit_status[doc_id.get()].set(pt.Concat(report_hash.get(), pt.Bytes("|PENDING"))),
            output.set(pt.Int(1))
        ])

    @external
    def update_audit_status(self, doc_id: pt.abi.Uint64, status: pt.abi.String, *, output: pt.abi.Bool):
        """Update audit result"""
        return pt.Seq([
            pt.Assert(pt.Txn.sender() == self.creator.get()),
            self.audit_status[doc_id.get()].set(status.get()),
            output.set(pt.Int(1))
        ])

    @external
    def delete_document(self, doc_id: pt.abi.Uint64, *, output: pt.abi.Bool):
        """Delete document (only owner)"""
        return pt.Seq([
            pt.Assert(pt.Txn.sender() == self.document_owner[doc_id.get()]),
            self.document_hash[doc_id.get()].set(pt.Bytes("DELETED")),
            self.audit_status[doc_id.get()].set(pt.Bytes("REVOKED")),
            output.set(pt.Int(1))
        ])

        @external
    def reassign_document_owner(self, doc_id: pt.abi.Uint64, new_owner: pt.abi.Address, *, output: pt.abi.Bool):
        """Reassign document ownership (only creator/admin)"""
        return pt.Seq([
            pt.Assert(pt.Txn.sender() == self.creator.get()),
            self.document_owner[doc_id.get()].set(new_owner.get()),
            output.set(pt.Int(1))
        ])


    @external
    def debug_log(self, log_id: pt.abi.Uint64, message: pt.abi.String, *, output: pt.abi.Bool):
        """Record a debug message"""
        return pt.Seq([
            self.debug_notes[log_id.get()].set(message.get()),
            output.set(pt.Int(1))
        ])

    @external(read_only=True)
    def get_document_info(self, doc_id: pt.abi.Uint64, *, output: pt.abi.String):
        """Fetch document status + owner"""
        info = pt.Concat(
            self.document_owner[doc_id.get()],
            pt.Bytes("|"),
            self.audit_status[doc_id.get()]
        )
        return output.set(info)


if __name__ == "__main__":
    import os
    if not os.path.exists("artifacts"):
        os.makedirs("artifacts")
    AlgoXzenApp().dump("artifacts")
