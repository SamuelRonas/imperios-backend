export interface Character {
  id: string;
  nome: string;
  classe: Classe;
  np: number;
  descricao: string;
  imagem?: string;
  atributos?: Atributos;
  status?: Status;
  // Permite qualquer outro atributo futuro
  [key: string]: any;
}

export type Classe =
  | "combatente"
  | "inumano"
  | "especialista";

export type Atributos = {
  forca: number;
  vigor: number;
  intelecto: number;
  agilidade: number;
  presenca: number;
};

export type Status = {
  pv: number;
  pe: number;
  ps: number;
};  