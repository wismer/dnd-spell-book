var Spell = React.createClass({displayName: 'Spell',
  render: function() {
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

var FilterPanel = React.createClass({displayName: 'FilterPanel',
  render: function() {
    var filterByLevel = this.props.filterByLevel;
    var spellLevels = this.props.spellLevels.map(function(checked, index){
      return (
        React.createElement("input", {
          type: "checkbox", 
          checked: checked, 
          onChange: filterByLevel.bind(null, index)
        }, index)
      )
    })

    return (
      React.createElement("div", null, 
        React.createElement("form", null, 
          React.createElement("input", {type: "text"}), 
          spellLevels
        )
      )
    )
  }
})

var ActiveSpellList = React.createClass({displayName: 'ActiveSpellList',
  render: function() {
    var spells = this.props.spells.map(function(spell, index){
      return React.createElement(Spell, React.__spread({key: index},  spell))
    })

    return (
      React.createElement("div", {id: "active-spells", style: {marginLeft: 150, width: 600}}, 
        this.props.children, 
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

    return {
      charClasses: charClasses,
      activeSpellList: [],
      filterControls: {
        spellLevels: [true, true, true, true, true, true, true, true, true]
      }
    };
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

  levelFilter: function(level, e) {
    var activeSpellList = this.state.activeSpellList;
    var filterControls = this.state.filterControls;

    filterControls.spellLevels[level] = e.target.checked;

    for (var i = 0; i < activeSpellList.length; i++) {
      var spell = activeSpellList[i];
      spell.active = filterControls.spellLevels[spell.level];
    }

    this.setState({ filterControls: filterControls, activeSpellList: activeSpellList })
  },

  loadSpells: function(klass, index, e) {
    e.preventDefault();
    var charClasses = this.state.charClasses;
    var character = charClasses[index];
    var activeSpellList = this.state.activeSpellList;
    if (klass.spells.length === 0) {
      $.getJSON("/character-class/" + character.name, function(data){
        data.spells = data.spells.map(function(spell){
          spell.active = true;
          return spell;
        })
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
    var spellFilters = this.state.filterControls;

    return (
      React.createElement("div", {id: "master-spell-list"}, 
        React.createElement("div", {id: "character-classes", style: {float: "left"}}, 
          charClasses
        ), 

        React.createElement(ActiveSpellList, {spells: this.state.activeSpellList}, 
          React.createElement(FilterPanel, {spellLevels: this.state.filterControls.spellLevels, filterByLevel: this.levelFilter})
        )
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
