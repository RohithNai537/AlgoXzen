import * as algokit from '@algorandfoundation/algokit-utils'
import { AlgoXzenContract } from './contract.algo'
import { AlgoClient } from '@algorandfoundation/algokit-utils/types/algo-client'

export async function deploy() {
  console.log('=== Deploying Algoxzencontracts ===')

  try {
    // Get algod client for LocalNet
    const algodClient = new AlgoClient({
      server: 'http://localhost',
      port: 4001,
      token: String(process.env.ALGOD_TOKEN) || ''
    })

    // Create the contract instance
    const contract = new AlgoXzenContract()
    
    console.log('Contract ready for deployment')
    
    return { contract, algodClient }
  } catch (error) {
    console.error('Error preparing contract:', error)
    throw error
  }
}
}
}
}
}
}
}
}
}
}
}
