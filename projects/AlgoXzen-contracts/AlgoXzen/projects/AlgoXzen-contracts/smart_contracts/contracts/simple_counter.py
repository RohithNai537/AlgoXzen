from beaker import Application, GlobalStateValue, create, external
import pyteal as pt
import os

class Counter(Application):
    """Small counter contract for testing."""
    counter = GlobalStateValue(
        stack_type=pt.TealType.uint64,
        default=pt.Int(0),
        descr="Simple counter"
    )

    @create
    def create(self):
        return self.counter.set_default()

    @external
    def inc(self, *, output: pt.abi.Uint64):
        return pt.Seq(
            self.counter.set(self.counter.get() + pt.Int(1)),
            output.set(self.counter.get())
        )

    @external(read_only=True)
    def get(self, *, output: pt.abi.Uint64):
        return output.set(self.counter.get())


if __name__ == '__main__':
    # ensure artifacts directory
    artifacts_dir = os.path.join(os.path.dirname(__file__), 'artifacts')
    os.makedirs(artifacts_dir, exist_ok=True)
    # dump the contract artifacts
    Counter().dump(artifacts_dir)
    print('Artifacts written to:', artifacts_dir)
