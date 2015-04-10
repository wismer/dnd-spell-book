class HomeController < ApplicationController
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

  def spell_query
    results = Spell.where(query_params)

    respond_to do |format|
      format.json { render json: { results: results } }
    end
  end

  def query_targets

  end

  private

  def query_params
    params.require(:spells).permit(:spell_type, :level, { :character_class => [] })
  end
end
