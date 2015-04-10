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

var Filter = React.createClass({displayName: 'Filter',
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
          React.createElement("li", {key: index, onClick: filterSelect.bind(null, itemFilter)}, 
            React.createElement("a", {href: "#"}, item.label)
          )
        )
      })

    var dropDown = React.createElement("a", {href: "#", 
      onMouseOver: filterSelect.bind(null, dropDownFilter), 
      className: "dropdown-toggle", 'aria-expanded': "false"}, 
      className.toUpperCase(), " ", React.createElement("span", {className: "caret"})
    )

    var mouseLeave = { category: cat, action: 'mouseleave' };

    var style = { display: this.props.isActive ? "block" : "none" };
    return (
      React.createElement("li", {
        onMouseLeave: filterSelect.bind(null, mouseLeave), 
        className: "dropdown"}, 
        dropDown, 
        React.createElement("ul", {
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
            ), 

            React.createElement("form", {className: "navbar-form navbar-left"}, 
              React.createElement("div", {className: "form-group"}, 
                React.createElement("div", {className: "checkbox"}, 
                  React.createElement("label", null, React.createElement("input", {type: "checkbox"}), " Spell School")
                )
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
    var spells = this.props.spells.map(function(spell, index){
      return React.createElement("div", {key: index}, spell.name)
    })

    return (
      React.createElement("div", {id: "spell-list", className: "container"}, 
        spells
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
