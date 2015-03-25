class HomeController < ApplicationController
  def spells

  end

  def spell_list
    spells = CharacterClass.find_by(name: params[:character_class].capitalize).spells

    respond_to do |format|
      format.json { render json: { spells: spells } }
    end
  end
end
