// Circular dependency, a classe facebook login herda da base controller, então o export dela tem que ser antes
export * from './base-controller'
export * from './facebook-login'
