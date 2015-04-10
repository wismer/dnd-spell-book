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
      { label: "Level 0 (cantrip)", active: false },
      { label: "Level 1", active: false },
      { label: "Level 2", active: false },
      { label: "Level 3", active: false },
      { label: "Level 4", active: false },
      { label: "Level 5", active: false },
      { label: "Level 6", active: false },
      { label: "Level 7", active: false },
      { label: "Level 8", active: false },
      { label: "Level 9", active: false }
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
    var handleSelect = this.props.handleSelect;
    var items = !this.props.isActive
      ? className.toUpperCase()
      : this.props.items.map(function(item, index){
        return <li key={index} onClick={handleSelect}><a href="#">{item.label}</a></li>
      })

    var dropDown = <a href="#"
      onMouseOver={onFilterSelect.bind(null, category)}
      className="dropdown-toggle" aria-expanded="false">
      {className.toUpperCase()} <span className="caret"></span>
    </a>

    var style = { display: this.props.isActive ? "block" : "none" };

    return (
      <li className='dropdown'>
        {dropDown}
        <ul
          onMouseLeave={onFilterSelect}
          className='dropdown-menu' style={style}>{items}</ul>
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
              <li className='dropdown'>
                <Filter filterSelect={onFilterSelect} name='schools' {...schools} />
              </li>
              <li className='dropdown'>
                <Filter filterSelect={onFilterSelect} name='levels' {...levels} />
              </li>
              <li className='dropdown'>
                <Filter filterSelect={onFilterSelect} name='Character Classes' {...charClasses} />
              </li>
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
      <div id='spell-list' className='container'>
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
      spells: [],
      activeQuery: {}
    };
  },

  handleFilter: function(category, e) {
    var spellFilters = this.state.spellFilters;
    for (var filter in spellFilters) {
      var spellFilter = spellFilters[filter];
      if (category) {
        if (spellFilter.isActive) {
          spellFilter.isActive = false;
        }

        if (category === filter) {
          spellFilter.isActive = true;
        }
      } else {
        spellFilter.isActive = false;
      }
    }

    this.setState({ spellFilters: spellFilters })
  },

  render: function() {
    var spellFilters = this.state.spellFilters;
    var queryResults = this.state.spells.filter(function(spell){
      return spell.active;
    })

    return (
      <div id='master-spell-list' className='container'>
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
