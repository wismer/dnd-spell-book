class CreateCharacterClasses < ActiveRecord::Migration
  def change
    create_table :character_classes do |t|
      t.string :name
      t.string :string

      t.timestamps null: false
    end
  end
end
