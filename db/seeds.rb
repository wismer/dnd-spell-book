# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
require 'json'

spell_data = JSON.parse(File.read "./db/spells.json")
character_classes = spell_data["spells"].keys.map do |char_class|
  id = CharacterClass.create(name: char_class.capitalize)
  spells = spell_data["spells"][char_class]
  spells.each do |spell|
    spell["character_class"] = id
    Spell.create(spell)
  end
end
