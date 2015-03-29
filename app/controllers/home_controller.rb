class HomeController < ApplicationController
  def spells

  end

  def spell_list
    spells = CharacterClass.find_by(name: params[:character_class].capitalize).spells

    respond_to do |format|
      format.json { render json: { spells: spells } }
    end
  end

  def all_spells
    results = Spell.all
    respond_to do |format|
      format.json { render json: { results: results } }
    end
  end
end
