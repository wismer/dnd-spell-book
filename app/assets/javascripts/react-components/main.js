var Spell = React.createClass({displayName: 'Spell',
  render: function() {
    var active = this.props.active;
    var spell;


    return (
      React.createElement("div", null, this.props.active ? this.props.name : "")
    )
  }
})

var CharacterClass = React.createClass({displayName: 'CharacterClass',
  render: function() {
    var spells = this.props.spells.map(function(spell){
      return React.createElement(Spell, React.__spread({},  spell))
    })

    return (
      React.createElement("div", {onClick: this.props.loadSpells}, 
        this.props.name, 
        this.props.active ? spells : ""
      )
    )
  }
})

var ActiveSpellList = React.createClass({displayName: 'ActiveSpellList',
  render: function() {
    var spells = this.props.spells.map(function(spell){
      return (
        React.createElement("div", {style: {float: "left", padding: 20}}, 
          React.createElement("h5", null, spell.name), 
          React.createElement("div", null, spell.text)
        )
      )
    })

    return (
      React.createElement("div", {id: "active-spells", style: {marginLeft: 150, width: 600}}, 
        spells
      )
    )
  }
})

var Menu = React.createClass({displayName: 'Menu',
  getInitialState: function() {
    var charClasses = this.props.charClasses.map(function(klass){
      return { name: klass, active: false, spells: [] }
    })

    return { charClasses: charClasses, activeSpellList: [] };
  },

  filterSpells: function(e) {
    var spellName = e.target.value;
    var charClasses = this.state.charClasses;
    charClasses.forEach(function(charClass){
      charClass.spells.forEach(function(spell){
        if (spell.name.match(spellName, "i")) {
          spell.active = true;
        } else {
          spell.active = false;
        }
      })
    });

    this.setState({ charClasses: charClasses })
  },

  loadSpells: function(klass, index, e) {
    e.preventDefault();
    var charClasses = this.state.charClasses;
    var character = charClasses[index];
    var activeSpellList = this.state.activeSpellList;
    if (klass.spells.length === 0) {
      $.getJSON("/character-class/" + character.name, function(data){
        this.setState({ activeSpellList: data.spells })
      }.bind(this))
    } else {
      character.active = !character.active;
      this.setState({ charClasses: charClasses })
    }
  },

  render: function() {
    var self = this;
    var charClasses = this.state.charClasses.map(function(klass, index){
      return React.createElement(CharacterClass, React.__spread({loadSpells: self.loadSpells.bind(null, klass, index)},  klass))
    })

    return (
      React.createElement("div", {id: "master-spell-list"}, 
        React.createElement("div", {id: "character-classes", style: {float: "left"}}, 
          React.createElement("input", {type: "text", onChange: this.filterSpells}), 
          charClasses
        ), 

        React.createElement(ActiveSpellList, {spells: this.state.activeSpellList})
      )
    )
  }
})


function crap(){
  var characterClasses = ["Cleric", "Sorceror", "Warlock", "Fighter", "Paladin", "Wizard", "Bard", "Ranger", "Druid"]
  React.render(
    React.createElement(Menu, {charClasses: characterClasses}),
    document.getElementById("spell-list")
  )
}
