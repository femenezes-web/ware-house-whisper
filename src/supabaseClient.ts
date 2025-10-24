// src/supabaseClient.ts

import { createClient } from "@supabase/supabase-js";

// O Vite acessa variáveis de ambiente com o prefixo VITE_
const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Inicializa e exporta o cliente para ser usado em qualquer lugar
export const supabase = createClient(supabaseUrl, supabaseKey);
