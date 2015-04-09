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
    { name: "Bard", active: false, id: 1 },
    { name: "Cleric", active: false, id: 2 },
    { name: "Druid", active: false, id: 3 },
    { name: "Paladin", active: false, id: 4 },
    { name: "Ranger", active: false, id: 5 },
    { name: "Sorceror", active: false, id: 6 },
    { name: "Warlock", active: false, id: 7 },
    { name: "Wizard", active: false, id: 8 }
  ]
}

var CharacterClass = React.createClass({
  render: function() {
    return (
      <div onClick={this.props.loadSpells}>
        {this.props.name}
        {this.props.active ? spells : ""}
      </div>
    )
  }
})

var SpellSchools = React.createClass({
  render: function() {
    var applyFilter = this.props.schoolFilter;
    var schools = this.props.schools;
    var schoolFilterPanel = Object.keys(schools).map(function(schoolName){
      var school = schools[schoolName];
      var className = school.active ? "school-active" : "school";

      return (
        <div key={schoolName}>
          <a onClick={applyFilter.bind(null, "schools", schoolName, "spell_type")} className={className} href="#">{schoolName}</a>
        </div>
      )
    })

    return (
      <div id='school-list'>
        {schoolFilterPanel}
      </div>
    )
  }
})

var SpellLevel = React.createClass({
  render: function() {
    return <div></div>
  }
})

var ClassRestricted = React.createClass({
  render: function() {
    var classFilter = this.props.classFilter;
    var charClasses = this.props.charClasses.map(function(charClass, i){
      return (
        <div>
          <a
            href="#"
            onClick={classFilter.bind(null, "characterClasses", i, "character_class_id")}
          >
            {charClass.name}
          </a>
        </div>
      )
    })
    return <div>{charClasses}</div>
  }
})

var FilterPanel = React.createClass({
  render: function() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
})

var QueryResults = React.createClass({
  render: function() {
    var spells = this.props.spells.map(function(spell){
      return <div>{spell.name}</div>
    })
    return (
      <div id='spell-list'>
        {spells}
      </div>
    )
  }
})

var Menu = React.createClass({
  getInitialState: function() {
    return { spellFilters: spellFilters, searchResults: [], spells: [] };
  },

  handleFilter: function(category, subcategory, spellKey, e) {
    var spellFilters = this.state.spellFilters;
    var filterCategory = spellFilters[category];
    var spells = this.state.spells;
    filterCategory[subcategory].active = !filterCategory[subcategory].active;
    if (subcategory === "characterClasses") {
      searchParams[spellKey] = filterCategory
    }
    var searchParams = {};
    searchParams[spellKey] = subcategory;
    if (filterCategory[subcategory].active) {
      $.getJSON("/query", { spells: searchParams }, function(data){
        debugger
      })
    }

    this.setState({ spellFilters: spellFilters, spells: spells })
  },

  render: function() {
    var spellFilters = this.state.spellFilters;
    var queryResults = this.state.spells.filter(function(spell){
      return spell.active;
    })

    return (
      <div id='master-spell-list'>
        <FilterPanel>
          <SpellSchools schoolFilter={this.handleFilter} schools={spellFilters.schools} />
          <SpellLevel levels={spellFilters.spellLevels} />
          <ClassRestricted charClasses={spellFilters.characterClasses} classFilter={this.handleFilter} />
        </FilterPanel>

        <QueryResults spells={queryResults} />
      </div>
    )
  }
})


function crap() {
  React.render(
    <Menu spellFilters={spellFilters}  />,
    document.getElementById("spell-list")
  )
}
