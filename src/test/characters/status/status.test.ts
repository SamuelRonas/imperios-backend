import { describe, it, expect } from "vitest";
import { Status } from "../../../main/characters/status/status";


const baseAtributos = {
  forca: 5,
  vigor: 3,
  intelecto: 2,
  agilidade: 3,
  presenca: 3
};

describe("Status Class", () => {

  describe("PV calculation", () => {

    it("combatente - cálculo correto", () => {
      const pv = Status.pv("combatente", baseAtributos, 80);
      // Fórmula: 20 + vig + (vig+4)*(np/5)
      //          20 + 2 + (2+4)*(50/5)
      //          22 + 6*10 = 22 + 60 = 82
      expect(pv).toBe(135);
    });

    it("inumano - cálculo correto", () => {
      const pv = Status.pv("inumano", baseAtributos, 50);
      // 14 + 2 + (2+3)*10 = 16 + 50 = 66
      expect(pv).toBe(66);
    });

    it("especialista - cálculo correto", () => {
      const pv = Status.pv("especialista", baseAtributos, 50);
      // 16 + 2 + (2+3)*10 = 18 + 50 = 68
      expect(pv).toBe(68);
    });

    it("aplica modificador", () => {
      const pv = Status.pv("combatente", baseAtributos, 50, 5);
      expect(pv).toBe(82 + 5);
    });

  });

  describe("PE calculation", () => {

    it("combatente - cálculo correto", () => {
      const pe = Status.pe("combatente", baseAtributos, 50);
      // 20 + 3 + (3+2)*10 = 23 + 50 = 73
      expect(pe).toBe(73);
    });

    it("inumano - cálculo correto", () => {
      const pe = Status.pe("inumano", baseAtributos, 50);
      // 4 + 3 + (3+4)*10 = 7 + 70 = 77
      expect(pe).toBe(77);
    });

    it("especialista - cálculo correto", () => {
      const pe = Status.pe("especialista", baseAtributos, 50);
      // 3 + 3 + (3+3)*10 = 6 + 60 = 66
      expect(pe).toBe(66);
    });

    it("aplica modificador", () => {
      const pe = Status.pe("especialista", baseAtributos, 50, 2);
      expect(pe).toBe(66 + 2);
    });

  });

  describe("PS calculation", () => {

    it("combatente - cálculo correto", () => {
      const ps = Status.ps("combatente", 50);
      // 12 + floor((50/5)*3) = 12 + 30 = 42
      expect(ps).toBe(42);
    });

    it("inumano - cálculo correto", () => {
      const ps = Status.ps("inumano", 50);
      // 18 + floor((50/5)*5) = 18 + 50 = 68
      expect(ps).toBe(68);
    });

    it("especialista - cálculo correto", () => {
      const ps = Status.ps("especialista", 50);
      // 16 + floor((50/5)*4) = 16 + 40 = 56
      expect(ps).toBe(56);
    });

  });

  describe("error cases", () => {
    it("classe inválida deve lançar erro no PV", () => {
      // @ts-ignore
      expect(() => Status.pv("invalida", baseAtributos, 10))
        .toThrow();
    });
  });

});
