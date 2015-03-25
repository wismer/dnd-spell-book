var Spell = React.createClass({
  render: function() {
    var active = this.props.active;
    var spell;


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

var ActiveSpellList = React.createClass({
  render: function() {
    var spells = this.props.spells.map(function(spell){
      return (
        <div style={{float: "left", padding: 20}}>
          <h5>{spell.name}</h5>
          <div>{spell.text}</div>
        </div>
      )
    })

    return (
      <div id='active-spells' style={{marginLeft: 150, width: 600}}>
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
      return <CharacterClass loadSpells={self.loadSpells.bind(null, klass, index)} {...klass} />
    })

    return (
      <div id='master-spell-list'>
        <div id='character-classes' style={{float: "left"}}>
          <input type='text' onChange={this.filterSpells} />
          {charClasses}
        </div>

        <ActiveSpellList spells={this.state.activeSpellList} />
      </div>
    )
  }
})


function crap(){
  var characterClasses = ["Cleric", "Sorceror", "Warlock", "Fighter", "Paladin", "Wizard", "Bard", "Ranger", "Druid"]
  React.render(
    <Menu charClasses={characterClasses} />,
    document.getElementById("spell-list")
  )
}
