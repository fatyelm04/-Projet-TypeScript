import type { Wizard, Spell, NewWizard } from "./types";
import { Log, MeasureTime, ValidateSpellPower } from "./decorators";

export class Repository<T extends { id: number }> {
  private items: T[] = [];

  @Log
  add(item: T): void {
    this.items.push(item);
  }

  @MeasureTime
  findById(id: number): T | undefined {
    return this.items.find(item => item.id === id);
  }

  getAll(): T[] {
    return [...this.items];
  }

  update(id: number, changes: Partial<T>): boolean {
    const item = this.findById(id);

    if (!item) return false;

    Object.assign(item, changes);
    return true;
  }
}

export class WizardRepository extends Repository<Wizard> {
  // Ex.1 : l'appelant ne fournit pas d'id, le référentiel l'attribue.
  create(newWizard: NewWizard): Wizard {
    const nextId =
      this.getAll().reduce((max, wizard) => Math.max(max, wizard.id), 0) + 1;

    const wizard: Wizard = { ...newWizard, id: nextId };
    this.add(wizard);
    return wizard;
  }

  // Ex.2 : Wizard["house"] est un type à accès indexé (= House).
  findByHouse(house: Wizard["house"]): Wizard[] {
    return this.getAll().filter(wizard => wizard.house === house);
  }
}

export class SpellRepository extends Repository<Spell> {
  // Ex.4 : refuse l'ajout d'un sort de puissance négative.
  @ValidateSpellPower
  override add(spell: Spell): void {
    super.add(spell);
  }
}
