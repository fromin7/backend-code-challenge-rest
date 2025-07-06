import { Schema, Prop } from '@nestjs/mongoose';

@Schema({ _id: false })
export class PokemonDimensions {
  @Prop({ type: Number, required: true })
  minimum: number;

  @Prop({ type: Number, required: true })
  maximum: number;
}

@Schema({ _id: false })
export class PokemonEvolutionRequirements {
  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: String, required: true })
  name: string;
}
