var spellFilters = {
  schools: {
    Abjuration: { active: false },
    Evocation: { active: false },
    Enchantment: { active: false },
    Conjuration: { active: false },
    Transmutation: { active: false },
    Illusion: { active: false },
    Divination: { active: false },
    Necromancy: { active: false }
  },

  // schools: [
  //   { name: "Abjuration", active: false },
  //   { name: "Evocation", active: false },
  //   { name: "Enchantment", active: false },
  //   { name: "Conjuration", active: false },
  //   { name: "Transmutation", active: false },
  //   { name: "Illusion", active: false },
  //   { name: "Divination", active: false },
  //   { name: "Necromancy", active: false }
  // ],

  spellLevels: [
    { label: 0, active: false },
    { label: 1, active: false },
    { label: 2, active: false },
    { label: 3, active: false },
    { label: 4, active: false },
    { label: 5, active: false },
    { label: 6, active: false },
    { label: 7, active: false },
    { label: 8, active: false },
    { label: 9, active: false },
  ],

  characterClasses: [
    { name: "Fighter", active: false },
    { name: "Bard", active: false },
    { name: "Cleric", active: false },
    { name: "Druid", active: false },
    { name: "Paladin", active: false },
    { name: "Ranger", active: false },
    { name: "Sorceror", active: false },
    { name: "Warlock", active: false },
    { name: "Wizard", active: false }
  ]
}

var CharacterClass = React.createClass({displayName: 'CharacterClass',
  render: function() {
    return (
      React.createElement("div", {onClick: this.props.loadSpells}, 
        this.props.name, 
        this.props.active ? spells : ""
      )
    )
  }
})

var SpellSchools = React.createClass({displayName: 'SpellSchools',
  render: function() {
    var applyFilter = this.props.schoolFilter;
    var schools = this.props.schools;
    var schoolFilterPanel = Object.keys(schools).map(function(schoolName){
      var school = schools[schoolName];
      var className = school.active ? "school-active" : "school";

      return (
        React.createElement("div", {key: schoolName}, 
          React.createElement("a", {onClick: applyFilter.bind(null, "schools", schoolName, "spell_type"), className: className, href: "#"}, schoolName)
        )
      )
    })

    return (
      React.createElement("div", {id: "school-list"}, 
        schoolFilterPanel
      )
    )
  }
})

var SpellLevel = React.createClass({displayName: 'SpellLevel',
  render: function() {
    return React.createElement("div", null)
  }
})

var ClassRestricted = React.createClass({displayName: 'ClassRestricted',
  render: function() {
    var classFilter = this.props.classFilter;
    var charClasses = this.props.charClasses.map(function(charClass, i){
      return (
        React.createElement("div", null, 
          React.createElement("a", {
            href: "#", 
            onClick: classFilter.bind(null, "characterClasses", i, "character_class_id")
          }, 
            charClass.name
          )
        )
      )
    })
    return React.createElement("div", null, charClasses)
  }
})

var FilterPanel = React.createClass({displayName: 'FilterPanel',
  render: function() {
    return (
      React.createElement("div", null, 
        this.props.children
      )
    )
  }
})

var QueryResults = React.createClass({displayName: 'QueryResults',
  render: function() {
    var spells = this.props.spells.map(function(spell){
      return React.createElement("div", null, spell.name)
    })
    return (
      React.createElement("div", {id: "spell-list"}, 
        spells
      )
    )
  }
})

var Menu = React.createClass({displayName: 'Menu',
  getInitialState: function() {
    return { spellFilters: spellFilters, searchResults: [], spells: [] };
  },

  componentWillMount: function() {
    $.getJSON("/spells", function(data){
      data.results.forEach(function(spell){
        spell.active = false;
      })

      this.setState({ spells: data.results })
    }.bind(this))
  },

  handleFilter: function(category, subcategory, spellKey, e) {
    var spellFilters = this.state.spellFilters;
    var filterCategory = spellFilters[category];
    var spells = this.state.spells;
    filterCategory[subcategory].active = !filterCategory[subcategory].active;

    if (filterCategory[subcategory].active) {
      for (var i = 0; i < spells.length; i++) {
        var spell = spells[i];
        if (spell[spellKey] === subcategory) {
          spell.active = true;
        }
      }
    } else {
      for (var i = 0; i < spells.length; i++) {
        var spell = spells[i];
        if (spell[spellKey] === subcategory) {
          spell.active = false;
        }
      }
    }

    this.setState({ spellFilters: spellFilters, spells: spells })
  },

  removeSpells: function(subcategory, spellKey) {
    var spells = this.state.spells;
    var searchResults = this.state.searchResults;
    var filteredResults = [];
    for (var i = 0; i < searchResults.length; i++) {
      var spell = searchResults[i];
      if (spell[spellKey] !== subcategory) {
        filteredResults.push(spell);
      }
    }

    this.setState({ spellFilters: this.state.spellFilters, searchResults: filteredResults })
  },

  addSpells: function(subcategory, spellKey) {
    var spells = this.state.spells;
    var filterResults = [];
    for (var i = 0; i < spells.length; i++) {
      var spell = spells[i];
      if (spell[spellKey] === subcategory) {
        filterResults.push(spell);
      }
    }

    filterResults = this.state.searchResults.concat(filterResults);
    this.setState({ spellFilters: this.state.spellFilters, searchResults: filterResults })
  },

  render: function() {
    var spellFilters = this.state.spellFilters;
    var queryResults = this.state.spells.filter(function(spell){
      return spell.active;
    })

    return (
      React.createElement("div", {id: "master-spell-list"}, 
        React.createElement(FilterPanel, null, 
          React.createElement(SpellSchools, {schoolFilter: this.handleFilter, schools: spellFilters.schools}), 
          React.createElement(SpellLevel, {levels: spellFilters.spellLevels}), 
          React.createElement(ClassRestricted, {charClasses: spellFilters.characterClasses, classFilter: this.handleFilter})
        ), 

        React.createElement(QueryResults, {spells: queryResults})
      )
    )
  }
})


function crap() {
  React.render(
    React.createElement(Menu, {spellFilters: spellFilters}),
    document.getElementById("spell-list")
  )
}
