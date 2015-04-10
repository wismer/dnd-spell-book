var spellFilters = {
  schools: {
    isActive: false,
    category: "schools",
    param: "spell_type",
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
    param: "level",
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
    param: "character_class",
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
    var cat = this.props.category;
    var handleSelect = this.props.handleSelect;
    var filterSelect = this.props.filterSelect;
    var dropDownFilter = { category: cat, action: 'dropdown' };

    var items = !this.props.isActive
      ? className.toUpperCase()
      : this.props.items.map(function(item, index){
        var itemFilter = { category: cat, item: item, action: 'select', index: index };
        return (
          <li key={index} onClick={filterSelect.bind(null, itemFilter)}>
            <a href="#">{item.label}</a>
          </li>
        )
      })

    var dropDown = <a href="#"
      onMouseOver={filterSelect.bind(null, dropDownFilter)}
      className="dropdown-toggle" aria-expanded="false">
      {className.toUpperCase()} <span className="caret"></span>
    </a>

    var mouseLeave = { category: cat, action: 'mouseleave' };

    var style = { display: this.props.isActive ? "block" : "none" };
    return (
      <li
        onMouseLeave={filterSelect.bind(null, mouseLeave)}
        className='dropdown'>
        {dropDown}
        <ul
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

            <form className="navbar-form navbar-left">
              <div className='form-group'>
                <div className='checkbox'>
                  <label><input type='checkbox' /> Spell School</label>
                </div>
              </div>
            </form>
          </div>
        </div>
      </nav>
    )
  }
})

var QueryResults = React.createClass({
  render: function() {
    var spells = this.props.spells.map(function(spell, index){
      return <div key={index}>{spell.name}</div>
    })

    return (
      <div id='spell-list' className='container'>
        {spells}
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

  handleDropDown: function(filter, spellFilters) {
    var spellFilter = spellFilters[filter.category];
    spellFilter.isActive = true;
    return spellFilters;
  },

  handleLeaveFilter: function(spellFilters) {
    for (filter in spellFilters) {
      spellFilters[filter].isActive = false;
    }
    return spellFilters;
  },

  handleOptionSelect: function(filter, spellFilters) {
    var spellFilter = spellFilters[filter.category];
    var spells = {};
    spellFilter.items.forEach(function(item){
      if (filter.item === item) {
        item.isActive = true;
      } else {
        item.isActive = false;
      }
    })

    for (var filter in spellFilters) {
      var spellFilter = spellFilters[filter];
      spells[spellFilter.param] = spellFilter.items.filter(function(item){
        return item.isActive;
      }).map(function(item){
        return item.id;
      })

      if (spells[spellFilter.param].length === 0) delete spells[spellFilter.param];
    }

    $.getJSON("/query-spells", {spells: spells}, function(res){
      this.setState({ spellFilters: spellFilters, searchResults: res.results })
    }.bind(this))
  },

  handleFilter: function(filter, e) {
    var spellFilters = this.props.spellFilters;
    if (filter.action === "dropdown") {
      spellFilters = this.handleDropDown(filter, spellFilters);
    } else if (filter.action === "mouseleave") {
      spellFilters = this.handleLeaveFilter(spellFilters);
    } else {
      this.handleOptionSelect(filter, spellFilters);
    }

    this.setState({ spellFilters: spellFilters });
  },

  render: function() {
    var spellFilters = this.state.spellFilters;
    var queryResults = this.state.searchResults;

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
