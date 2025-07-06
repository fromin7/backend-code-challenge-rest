todo: finish this.

# Setup & User Credentials

The seeder inserts 9 users with identifiers "USER[number]" and PIN that corresponds with the user number (i.e. USER1 has PIN 0001, USER2 has 0002 etc.). You can use the identifier and the PIN to obtain a signed JWT token from the corresponding endpoint.

# Data Modelling Pattern

Since it is not entirely clear how the app may or may not develop further, there is no one single correct way to model the data. I am adding comments on why I decided to model the data the way I did below.

For Pokemon Types, I decided to use data denormalization, where I have the name of the type both in the `pokemon_types` and `pokemon` collections in order to reduce the number of lookups required to get the full Pokemon document and/or the list of pokemon types.

The downside of it is of course that they need to be kept consistent in case we wanted to add renaming of the type, of course, but in the case of our data structure, it is a valid solution.

On the other hand, for `pokemon_attacks`, I am actually referencing the attacks by their ObjectId in the `pokemons` collection, because it is a more complex object that may be more difficult to keep consistent and is more likely to actually be edittable in the future.

A similar reason applies for `evolutions` and `previousEvolutions`, where I am referencing the actual Pokemon by its `id` rather than denormalizing the data.

It may look inconsistent, but I have done this primarily to demonstrate both of these approaches in the single example.

The actual solution that I would pick in a real-world scenario would largely depend on the project scope, planned features, the likelihood of needing to edit the referenced data in the future and the expected complexity to maintain their consistency.

It is furthermore debatable if the `_id` in Pokemons should use the string id, parsed number or a newly generated MongoDB ObjectId.
