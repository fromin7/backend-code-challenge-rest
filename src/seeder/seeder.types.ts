type PokemonEvolutionJson = {
  id: number;
  name: string;
};

type PokemonAttackJson = {
  name: string;
  type: string;
  damage: number;
};

export type PokemonJsonRecord = {
  id: string;
  name: string;
  classification: string;
  types: string[];
  resistant: string[];
  weaknesses: string[];
  weight: {
    minimum: string;
    maximum: string;
  };
  height: {
    minimum: string;
    maximum: string;
  };
  fleeRate: number;
  'Pokémon Class'?: string;
  'Previous evolution(s)'?: PokemonEvolutionJson[];
  'Common Capture Area'?: string;
  evolutionRequirements?: {
    amount: number;
    name: string;
  };
  evolutions?: PokemonEvolutionJson[];
  maxCP: number;
  maxHP: number;
  attacks: {
    fast: PokemonAttackJson[];
    special: PokemonAttackJson[];
  };
} & {
  [key: string]: unknown;
};

export type PokemonsJson = PokemonJsonRecord[];
