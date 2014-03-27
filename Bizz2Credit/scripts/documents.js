var i = 0;

// datasource below is customized for demo purposes.
var foo = new kendo.data.DataSource({
  transport: {
    read: function(options) {
      var max = i + 5;
      var data = [];
      for (; i < max; i ++) {
        data.unshift({ name: "record" + i, modified: +new Date() });
      }
                            options.success(data);


    }
  }
});
function viewInit(e)
{
    e.view.element.find("#listView").kendoMobileListView({
    dataSource: [ "foo", "bar" ],
    filterable: true
    }); 
}
