import { Schema, Prop } from '@nestjs/mongoose';

@Schema()
export class PokemonWeight {
  @Prop({ type: String, required: true })
  minimum: string;

  @Prop({ type: String, required: true })
  maximum: string;
}

@Schema()
export class PokemonEvolutionRequirements {
  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: String, required: true })
  name: string;
}

@Schema()
export class PokemonEvolution {
  @Prop({ type: Number, required: true })
  _id: number;

  @Prop({ type: String, required: true })
  name: string;
}

@Schema()
class PokemonAttack {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  type: string;

  @Prop({ type: Number, required: true })
  damage: number;
}

@Schema()
export class PokemonAttacks {
  @Prop({ type: [PokemonAttack] })
  fast: [PokemonAttack];

  @Prop({ type: [PokemonAttack] })
  special: [PokemonAttack];
}
