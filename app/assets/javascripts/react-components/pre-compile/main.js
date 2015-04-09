var spellFilters = {
  schools: {
    isActive: false,
    category: "schools",
    items: [
      { label: "Abjuration", active: false },
      { label: "Evocation", active: false },
      { label: "Enchantment", active: false },
      { label: "Conjuration", active: false },
      { label: "Transmutation", active: false },
      { label: "Illusion", active: false },
      { label: "Divination", active: false },
      { label: "Necromancy", active: false }
    ]
  },

  spellLevels: {
    isActive: false,
    category: "spellLevels",
    items: [
      { label: 0, active: false },
      { label: 1, active: false },
      { label: 2, active: false },
      { label: 3, active: false },
      { label: 4, active: false },
      { label: 5, active: false },
      { label: 6, active: false },
      { label: 7, active: false },
      { label: 8, active: false },
      { label: 9, active: false }
    ]
  },

  characterClasses: {
    isActive: false,
    category: "characterClasses",
    items: [
      { label: "Bard", active: false, id: 1 },
      { label: "Cleric", active: false, id: 2 },
      { label: "Druid", active: false, id: 3 },
      { label: "Paladin", active: false, id: 4 },
      { label: "Ranger", active: false, id: 5 },
      { label: "Sorceror", active: false, id: 6 },
      { label: "Warlock", active: false, id: 7 },
      { label: "Wizard", active: false, id: 8 }
    ]
  }
}

var Filter = React.createClass({
  render: function() {
    var className = this.props.name;
    var category = this.props.category;
    var onFilterSelect = this.props.filterSelect;
    var items = !this.props.isActive
      ? className.toUpperCase()
      : this.props.items.map(function(item, index){
        return <li key={index}><a href="#">{item.label}</a></li>
      })

    var dropDown = <a href="#"
      onClick={onFilterSelect.bind(null, category)}
      className="dropdown-toggle" aria-expanded="false">
      {className.toUpperCase()} <span className="caret"></span>
    </a>

    var style = { display: this.props.isActive ? "block" : "none" };

    return (
      <li className='dropdown'>
        {dropDown}
        <ul className='dropdown-menu' style={style}>{items}</ul>
      </li>
    )
  }
})

var FilterPanel = React.createClass({
  render: function() {
    var schools = this.props.schools;
    var levels = this.props.spellLevels;
    var charClasses = this.props.characterClasses;
    var onFilterSelect = this.props.onFilterSelect;

    return (
      <nav className='navbar navbar-default'>
        <div className='container-fluid'>
          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className='nav navbar-nav'>
              <li className='dropdown'><Filter filterSelect={onFilterSelect} name='schools' {...schools} /></li>
              <li className='dropdown'><Filter filterSelect={onFilterSelect} name='levels' {...levels} /></li>
              <li className='dropdown'><Filter filterSelect={onFilterSelect} name='Character Classes' {...charClasses} /></li>
            </ul>
          </div>
        </div>
      </nav>
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
        <ul className='navbar nav'>
          {spells}
        </ul>
      </div>
    )
  }
})

var Menu = React.createClass({
  getInitialState: function() {
    return {
      spellFilters: spellFilters,
      searchResults: [],
      spells: []
    };
  },

  handleFilter: function(category, e) {
    var spellFilters = this.state.spellFilters;
    var filter = spellFilters[category];
    filter.isActive = !filter.isActive;
    this.setState({ spellFilters: spellFilters })
  },

  render: function() {
    var spellFilters = this.state.spellFilters;
    var queryResults = this.state.spells.filter(function(spell){
      return spell.active;
    })
    var activeFilter = spellFilters.activeFilter;

    return (
      <div id='master-spell-list'>
        <FilterPanel onFilterSelect={this.handleFilter} {...spellFilters} />
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
