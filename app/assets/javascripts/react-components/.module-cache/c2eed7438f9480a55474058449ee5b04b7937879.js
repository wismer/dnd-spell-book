var Menu = React.createClass({displayName: 'Menu',
  render: function() {
    return React.createElement("div", null, "poop")
  }
})



function crap(){
  React.render(
    React.createElement(Menu, null),
    document.body
  )
}

crap()
