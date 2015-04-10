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

var Filter = React.createClass({displayName: 'Filter',
  render: function() {
    var className = this.props.name;
    var category = this.props.category;
    var onFilterSelect = this.props.filterSelect;
    var handleSelect = this.props.handleSelect;
    var items = !this.props.isActive
      ? className.toUpperCase()
      : this.props.items.map(function(item, index){
        return React.createElement("li", {key: index, onClick: handleSelect}, React.createElement("a", {href: "#"}, item.label))
      })

    var dropDown = React.createElement("a", {href: "#", 
      onMouseOver: onFilterSelect.bind(null, category), 
      className: "dropdown-toggle", 'aria-expanded': "false"}, 
      className.toUpperCase(), " ", React.createElement("span", {className: "caret"})
    )

    var style = { display: this.props.isActive ? "block" : "none" };

    return (
      React.createElement("li", {className: "dropdown"}, 
        dropDown, 
        React.createElement("ul", {
          onMouseLeave: onFilterSelect, 
          className: "dropdown-menu", style: style}, items)
      )
    )
  }
})

var FilterPanel = React.createClass({displayName: 'FilterPanel',
  render: function() {
    var schools = this.props.schools;
    var levels = this.props.spellLevels;
    var charClasses = this.props.characterClasses;
    var onFilterSelect = this.props.onFilterSelect;

    return (
      React.createElement("nav", {className: "navbar navbar-default"}, 
        React.createElement("div", {className: "container-fluid"}, 
          React.createElement("div", {className: "collapse navbar-collapse", id: "bs-example-navbar-collapse-1"}, 
            React.createElement("ul", {className: "nav navbar-nav"}, 
              React.createElement("li", {className: "dropdown"}, 
                React.createElement(Filter, React.__spread({filterSelect: onFilterSelect, name: "schools"},  schools))
              ), 
              React.createElement("li", {className: "dropdown"}, 
                React.createElement(Filter, React.__spread({filterSelect: onFilterSelect, name: "levels"},  levels))
              ), 
              React.createElement("li", {className: "dropdown"}, 
                React.createElement(Filter, React.__spread({filterSelect: onFilterSelect, name: "Character Classes"},  charClasses))
              )
            )
          )
        )
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
      React.createElement("div", {id: "spell-list", className: "container"}, 
        React.createElement("ul", {className: "navbar nav"}, 
          spells
        )
      )
    )
  }
})

var Menu = React.createClass({displayName: 'Menu',
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
      React.createElement("div", {id: "master-spell-list", className: "container"}, 
        React.createElement(FilterPanel, React.__spread({onFilterSelect: this.handleFilter},  spellFilters)), 
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
