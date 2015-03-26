var Spell = React.createClass({
  render: function() {
    return (
      <div>{this.props.active ? this.props.name : ""}</div>
    )
  }
})

var CharacterClass = React.createClass({
  render: function() {
    var spells = this.props.spells.map(function(spell){
      return <Spell {...spell} />
    })

    return (
      <div onClick={this.props.loadSpells}>
        {this.props.name}
        {this.props.active ? spells : ""}
      </div>
    )
  }
})

var FilterPanel = React.createClass({
  render: function() {
    var filterByLevel = this.props.filterByLevel;
    var spellLevels = this.props.spellLevels.map(function(checked, index){
      return (
        <input
          type='checkbox'
          checked={checked}
          onChange={filterByLevel.bind(null, index)}
        >{index}</input>
      )
    })

    return (
      <div>
        <form>
          <input type='text' />
          {spellLevels}
        </form>
      </div>
    )
  }
})

var ActiveSpellList = React.createClass({
  render: function() {
    var spells = this.props.spells.map(function(spell, index){
      return <Spell key={index} {...spell} />
    })

    return (
      <div id='active-spells' style={{marginLeft: 150, width: 600}}>
        {this.props.children}
        {spells}
      </div>
    )
  }
})

var Menu = React.createClass({
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
      return <CharacterClass loadSpells={self.loadSpells.bind(null, klass, index)} {...klass} />
    })
    var spellFilters = this.state.filterControls;

    return (
      <div id='master-spell-list'>
        <div id='character-classes' style={{float: "left"}}>
          {charClasses}
        </div>

        <ActiveSpellList spells={this.state.activeSpellList}>
          <FilterPanel spellLevels={this.state.filterControls.spellLevels} filterByLevel={this.levelFilter} />
        </ActiveSpellList>
      </div>
    )
  }
})


function crap(){
  var characterClasses = ["Cleric", "Sorceror", "Warlock", "Fighter", "Paladin", "Wizard", "Bard", "Ranger", "Druid"]
  React.render(
    <Menu charClasses={characterClasses}  />,
    document.getElementById("spell-list")
  )
}
