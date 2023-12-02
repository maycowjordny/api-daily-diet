import { Knex } from "knex";

declare module "knex/types/tables" {
  export interface Tables {
    transactions: {
      id: string;
      title: string;
      amount: number;
      created_at: string;
      session_id?: string;
    };

    meals: {
      id: string;
      title: string;
      description: string;
      created_at: string;
      user_id: string;
      is_diet: boolean;
      best_sequence: number;
    };

    users: {
      id: string;
      name: string;
      email: string;
      password: string;
    };
  }
}
