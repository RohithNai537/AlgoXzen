import algokit_utils
from algokit_utils import AlgorandClient

def deploy() -> None:
    algorand = AlgorandClient.from_environment()
    
    deployer = algorand.account.from_environment("DEPLOYER")

    app_client = algorand.client.get_app("smart_contracts")

    result = app_client.deploy(
        on_update="replace",
        on_schema_break="fail",
        sender=deployer,
    )

    print("App deployed:", result.app_id)
