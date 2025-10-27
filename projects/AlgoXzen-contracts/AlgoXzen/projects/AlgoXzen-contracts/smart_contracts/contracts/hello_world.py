from pyteal import *
import os

def approval_program():
    # simple approval program that always approves
    return Return(Int(1))

def clear_state_program():
    return Return(Int(1))

if __name__ == '__main__':
    out_dir = os.path.join(os.path.dirname(__file__), 'artifacts')
    os.makedirs(out_dir, exist_ok=True)

    approval_teal = compileTeal(approval_program(), mode=Mode.Application, version=6)
    clear_teal = compileTeal(clear_state_program(), mode=Mode.Application, version=6)

    with open(os.path.join(out_dir, 'hello_approval.teal'), 'w') as f:
        f.write(approval_teal)

    with open(os.path.join(out_dir, 'hello_clear.teal'), 'w') as f:
        f.write(clear_teal)

    print('Wrote TEAL to', out_dir)
