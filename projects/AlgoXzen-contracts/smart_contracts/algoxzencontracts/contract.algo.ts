import { Contract } from '@algorandfoundation/tealscript'

/**
 * A basic Algorand smart contract
 */
export class AlgoXzenContract extends Contract {
  projectCount = 0
  
  createApplication(): void {
    // Initialize contract
    this.projectCount = 0
  }
  
  /**
   * Create a new project
   */
  createProject(): void {
    // Only the creator can create projects
    assert(this.txn.sender === this.txn.sender)
    this.projectCount += 1
  }
  
  /**
   * Get project count
   */
  getProjectCount(): number {
    return this.projectCount
  }
}
