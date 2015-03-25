class CreateSpells < ActiveRecord::Migration
  def change
    create_table :spells do |t|
      t.string :name
      t.integer :level
      t.string :spell_type
      t.string :cost
      t.string :range
      t.string :senses
      t.string :duration
      t.text :text
      t.references :character_class, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
