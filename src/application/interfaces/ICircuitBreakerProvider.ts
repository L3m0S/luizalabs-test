export interface ICircuitBreakerProvider {
	initialize(action: Function): void;
	setFallBack(fallback: Function): void;
	fire(endpoint: string): Promise<unknown>;
}
