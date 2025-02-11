import { ICircuitBreakerProvider } from '@application/interfaces/ICircuitBreakerProvider';
import CircuitBreaker from 'opossum';
import { autoInjectable } from 'tsyringe';

@autoInjectable()
export class OpossumCircuitBreakerProvider implements ICircuitBreakerProvider {
  private circuitBreaker!: CircuitBreaker;

  public initialize(action: Function): void {
    this.circuitBreaker = new CircuitBreaker(action.bind(this), {
      timeout: +!process?.env?.DEFAULT_API_REQUESTS_TIMEOUT,
      errorThresholdPercentage: +!process?.env?.CB_ERROR_THRESHOLD_PERCENTAGE,
      resetTimeout: +!process?.env?.CB_RESET_TIMEOUT_MS,
    });
  }

  public setFallBack(fallback: Function): void {
    this.circuitBreaker.fallback(() => fallback);
  }

  public async fire(endpoint: string): Promise<unknown> {
    return await this.circuitBreaker.fire(endpoint);
  }
}
