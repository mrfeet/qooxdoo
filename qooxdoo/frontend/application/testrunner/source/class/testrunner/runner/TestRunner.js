/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007 1&1 Internet AG, Germany, http://www.1and1.org

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Thomas Herchenroeder (thron7)
     * Fabian Jakobs (fjakobs)

************************************************************************ */

/* ************************************************************************

#module(testrunner)

************************************************************************ */

/**
 * The GUI definition of the qooxdoo unit test runner.
 */

qx.Class.define("testrunner.runner.TestRunner",
{
  extend : qx.ui.layout.VerticalBoxLayout,

  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */
  construct : function()
  {
    this.base(arguments);
    this.set({
      height : "100%",
      width : "100%"
    });
    this.widgets = {};
    this.tests   = {};

    // Header Pane
    this.header = this.__makeHeader();
    this.add(this.header);

    // Main Pane
    // split
    var mainsplit = new qx.ui.splitpane.HorizontalSplitPane(250, "1*");
    this.add(mainsplit);
    this.mainsplit = mainsplit;
    mainsplit.setLiveResize(true);
    mainsplit.set({
      height : "1*"
    });

    // Left -- is done when iframe is loaded
    var left = this.__makeLeft();
    this.left = left;
    this.mainsplit.addLeft(left);

    // Right
    var right = new qx.ui.layout.VerticalBoxLayout();
    right.set({
      //border : "inset",
      //spacing : 10,
      //padding : 10,
      height : "100%",
      width : "100%"
    });
    mainsplit.addRight(right);

    // Toolbar
    this.toolbar = this.__makeToolbar();
    this.toolbar.set({
      height : 30,
      show   : "icon",
      verticalChildrenAlign : "middle",
      padding : [0,3]
    });
    right.add(this.toolbar);

    var groupBox = new qx.ui.groupbox.GroupBox();
    groupBox.set({
      height : "auto"
    });
    right.add(groupBox);

    var vert = new qx.ui.layout.VerticalBoxLayout();
    vert.set({
      height : "auto",
      width  : "100%"
    });
    groupBox.add(vert);

    // status
    var statuspane = this.__makeStatus();
    //right.add(statuspane);
    vert.add(statuspane);
    this.widgets["statuspane"] = statuspane;

    // progress bar
    var progress = this.__makeProgress();
    vert.add(progress);
    //right.add(progress);

    // output views
    var buttview = this.__makeOutputViews();
    right.add(buttview);

    // add eventhandler now, after objects are created
    this.widgets["treeview"].getBar().getManager().addEventListener("changeSelected",
      function (e)
      {
        if (e.getData().tree.getSelectedElement() == null)
        {
          this.widgets["toolbar.runbutton"].setEnabled(false);
        }
      },
      this);
    this.widgets["treeview.bsb1"].setChecked(true);

    // Last but not least:
    // Hidden IFrame for test runs
    var iframe = new qx.ui.embed.Iframe("html/QooxdooTest.html?testclass=testrunner.test");
    iframe.setEdge(0);
    this.iframe = iframe;
    iframe.addToDocument();
    this.setZIndex(5);

    // Get the TestLoader from the Iframe (in the event handler)
    iframe.addEventListener("load", this.ehIframeOnLoad, this);

    // EXPERIMENTAL !
    //var treetest = new testrunner.runner.TreeTest();


  }, //constructor


  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    succCnt :
    {
      check : "Integer",
      init  : 0,
      apply : "_applySuccCnt"
    },

    failCnt :
    {
      check : "Integer",
      init  : 0,
      apply : "_applyFailCnt"
    }
  },


  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */
  members: {

    // ------------------------------------------------------------------------
    //   CONSTRUCTOR HELPERS
    // ------------------------------------------------------------------------


        /**
     * Create the header widget
     *
     * @return {qx.ui.embed.HtmlEmbed} The header widget
     */
    __makeHeader : function()
    {
      var header = new qx.ui.embed.HtmlEmbed(
        "<h1>" +
        "<span>" + "qooxdoo Test Runner" + "</span>" +
        "</h1>" +
        "<div class='version'>qooxdoo " + qx.core.Version.toString() + "</div>"
      );
      header.setHtmlProperty("id", "header");
      header.setStyleProperty(
        "background",
        "#134275 url(" +
        qx.manager.object.AliasManager.getInstance().resolvePath("testrunner/image/colorstrip.gif") +
        ") top left repeat-x"
      );
      header.setHeight(70);
      return header;
    },


    __makeToolbar : function () {
      var toolbar = new qx.ui.toolbar.ToolBar;

      // -- run button
      this.runbutton = new qx.ui.toolbar.Button("Run Test", "icon/16/actions/media-playback-start.png");
      toolbar.add(this.runbutton);
      this.widgets["toolbar.runbutton"] = this.runbutton;
      this.runbutton.addEventListener("execute", this.runTest, this);
      this.runbutton.setToolTip(new qx.ui.popup.ToolTip("Run selected test(s)"));

      toolbar.add(new qx.ui.toolbar.Separator);

      this.testSuiteUrl = new qx.ui.form.TextField("html/QooxdooTest.html?testclass=testrunner.test");
      toolbar.add(this.testSuiteUrl);
      this.testSuiteUrl.setToolTip(new qx.ui.popup.ToolTip("Test backend application URL"));
      this.testSuiteUrl.set({
        width : 300,
        marginRight : 5
      });
      this.testSuiteUrl.addEventListener("keydown", function (e) {
        if (e.getKeyIdentifier() == "Enter") {
          this.reloadTestSuite();
        }
      }, this);

      // -- reload button
      this.reloadbutton = new qx.ui.toolbar.Button("Reload", "icon/16/actions/view-refresh.png");
      toolbar.add(this.reloadbutton);
      this.reloadbutton.setToolTip(new qx.ui.popup.ToolTip("Reload test backend application"));
      this.reloadbutton.addEventListener("execute", this.reloadTestSuite, this);

      toolbar.add((new qx.ui.basic.HorizontalSpacer).set({width:"1*"}));

      // -- reload switch
      var part = new qx.ui.toolbar.Part();
      part.setVerticalChildrenAlign("middle");
      toolbar.add(part);
      this.reloadswitch = new qx.ui.toolbar.CheckBox("Reload before Test",
                                                     "testrunner/image/yellow_diamond_hollow18.gif");
      part.add(this.reloadswitch);
      this.reloadswitch.setShow("both");
      this.reloadswitch.setToolTip(new qx.ui.popup.ToolTip("Always reload test backend before testing"));
      this.reloadswitch.addEventListener("changeChecked",function (e)
      {
        if (this.reloadswitch.getChecked())
        {
          this.reloadswitch.setIcon("testrunner/image/yellow_diamond_full18.gif");
        } else
        {
          this.reloadswitch.setIcon("testrunner/image/yellow_diamond_hollow18.gif");
        }
      },this);
      this.reloadswitch.setChecked(true);

      return toolbar;
    }, //makeToolbar


    __makeOutputViews : function ()
    {

      // Main Container
      var buttview = new qx.ui.pageview.tabview.TabView();
      buttview.set({
        height : "1*"
      });

      var bsb1 = new qx.ui.pageview.tabview.Button("Test Results", "icon/16/devices/video-display.png");
      var bsb2 = new qx.ui.pageview.tabview.Button("Log", "icon/16/apps/graphics-snapshot.png");
      bsb1.setChecked(true);
      buttview.getBar().add(bsb1, bsb2);

      var p1 = new qx.ui.pageview.tabview.Page(bsb1);
      p1.set({
        padding : [5]
        //spacing   : 5
      });
      var p2 = new qx.ui.pageview.tabview.Page(bsb2);
      p2.set({
        padding : [5]
      });
      buttview.getPane().add(p1, p2);

      // First Page
      var f1 = new testrunner.runner.TestResultView();
      this.f1 = f1;
      p1.add(f1);
      f1.set({
        overflow: "auto",
        height : "100%",
        width : "100%"
      });

      // Second Page
      var pp2 = new qx.ui.layout.VerticalBoxLayout();
      p2.add(pp2);
      pp2.set({
        height : "100%",
        width  : "100%"
      });

      this.f2 = new qx.ui.form.TextArea("Session Log, listing test invokations and all outputs");
      this.f2.set({
        height : "1*",
        width : "100%"
      });

      var ff1 = new qx.ui.toolbar.ToolBar;
      var ff1_b1 = new qx.ui.toolbar.Button("Clear");
      ff1.add(ff1_b1);
      ff1_b1.set({
        width : "auto"
      });
      ff1_b1.addEventListener("execute", function (e) {
        this.f2.setValue("");
      }, this);
      pp2.add(ff1, this.f2);

      // Third Page
      // -- Tab Button
      var bsb3 = new qx.ui.pageview.tabview.Button("Tabled Results","icon/16/apps/graphics-snapshot.png");
      buttview.getBar().add(bsb3);

      // -- Tab Pane
      var p3 = new qx.ui.pageview.tabview.Page(bsb3);
      p3.set({
        padding : [5]
      });
      buttview.getPane().add(p3);

      // -- Pane Content
      var f3 =  new qx.ui.embed.HtmlEmbed("Results should go into a table here.");
      p3.add(f3);


      return buttview;
    }, //makeOutputViews

    // -------------------------------------------------------------------------

    /**
     * Tree View in Left Pane
     * - only make root node; rest will befilled when iframe has loaded (with
     *   leftReloadTree)
    */
    __makeLeft: function ()
    {
      var buttview = new qx.ui.pageview.buttonview.ButtonView();
      buttview.set({
        height : "100%",
        width  : "100%"
      });
      buttview.getBar().set({
        backgroundColor : "#E1EEFF",
        height          : 29
      });
      this.widgets["treeview"] = buttview;

      // full view
      var bsb1 = new qx.ui.pageview.buttonview.Button("Full Tree","icon/16/actions/view-pane-tree.png");
      buttview.getBar().add(bsb1);
      this.widgets["treeview.bsb1"] = bsb1;
      bsb1.setShow("icon");
      bsb1.setToolTip(new qx.ui.popup.ToolTip("Full tree view"));

      var p1 = new qx.ui.pageview.buttonview.Page(bsb1);
      p1.set({
        width   : "100%",
        height  : "100%",
        padding : [0]
        //spacing   : 5
      });
      buttview.getPane().add(p1);

      var tree = new qx.ui.tree.Tree("Tests");
      p1.add(tree);
      this.tree = tree;
      this.widgets["treeview.full"] = tree;
      bsb1.tree = tree;    // for changeSelected handling
      tree.set({
        width : "100%",
        height : "100%",
        //padding : [10],
        overflow: "auto",
        //border : "inset",
        backgroundColor: "white"
      });
      tree.getManager().addEventListener("changeSelection", this.treeGetSelection, this);

      // flat view
      var bsb2 = new qx.ui.pageview.buttonview.Button("Flat Tree","icon/16/actions/view-pane-text.png");
      buttview.getBar().add(bsb2);
      this.widgets["treeview.bsb2"] = bsb2;
      bsb2.setShow("icon");
      bsb2.setToolTip(new qx.ui.popup.ToolTip("Flat tree view (only one level of containers)"));

      var p2 = new qx.ui.pageview.buttonview.Page(bsb2);
      p2.set({
        padding : [5]
      });
      buttview.getPane().add(p2);

      var tree1 = new qx.ui.tree.Tree("Tests");
      p2.add(tree1);
      this.tree1 = tree1;
      this.widgets["treeview.flat"] = tree1;
      bsb2.tree = tree1;    // for changeSelected handling
      tree1.set({
        width : "100%",
        height : "100%",
        //padding : [10],
        overflow: "auto",
        //border : "inset",
        backgroundColor: "white"
      });
      tree1.getManager().addEventListener("changeSelection", this.treeGetSelection, this);

      // fake unique tree for selection (better to have a selection on the model)
      this.tree = {};
      var that  = this;
      this.tree.getSelectedElement = function ()
      {
        var sel = that.widgets["treeview"].getBar().getManager().getSelected();
        var elem;
        if (sel.getLabel() == "Full Tree")
        {
          elem = that.widgets["treeview.full"].getSelectedElement();
        } else
        {
          elem = that.widgets["treeview.flat"].getSelectedElement();
        }

        return elem;
      };


      return buttview;
    }, //makeLeft


    // -------------------------------------------------------------------------

    __makeProgress: function ()
    {
      var progress = new qx.ui.layout.HorizontalBoxLayout();
      progress.set({
        height: "auto",
        padding: [10],
        spacing : 10,
        width : "100%"
      });

      var progressb = new testrunner.runner.ProgressBar();
      progress.add(progressb);
      progressb.set({
        showStepStatus: true,
        showPcntStatus: true,
        barColor: "#36a618"
      });
      this.widgets["progresspane"] = progress;
      this.widgets["progresspane.progressbar"] = progressb;
      progress.add(new qx.ui.toolbar.Separator);

      /* Wishlist:
      var progressb = new qx.ui.component.ProgressBar();
      progressb.set({
        scale    : null,   // display no scale
        startLabel : "0%",
        endLabel   : "100%",
        fillLabel : "(0/10)", // status label right of bar
        fillStatus: "60%"     // fill degree of the progress bar
      });
      progressb.update("9/15"); // update progress
      progressb.update("68%");  // dito
      */

      progress.add(new qx.ui.basic.Label("Failed: "));
      var failcnt = new qx.ui.basic.Label("0");
      progress.add(failcnt);
      failcnt.set({
        backgroundColor : "#C1ECFF"
      });

      progress.add(new qx.ui.basic.Label("Succeeded: "));
      var succcnt = new qx.ui.basic.Label("0");
      progress.add(succcnt);
      succcnt.set({
        backgroundColor : "#C1ECFF"
      });
      this.widgets["progresspane.succ_cnt"] = succcnt;
      this.widgets["progresspane.fail_cnt"] = failcnt;

      return progress;
    }, //makeProgress


    // -------------------------------------------------------------------------

    __makeStatus: function (){
      var statuspane = new qx.ui.layout.HorizontalBoxLayout();
      statuspane.set({
        padding: [10],
        spacing : 10,
        height : "auto",
        width : "100%"
      });
      // Test Info
      statuspane.add(new qx.ui.basic.Label("Selected Test: "));
      var l1 = new qx.ui.basic.Label("");
      statuspane.add(l1);
      l1.set({
        backgroundColor : "#C1ECFF"
      });
      this.widgets["statuspane.current"] = l1;
      statuspane.add(new qx.ui.basic.Label("Number of Tests: "));
      var l2 = new qx.ui.basic.Label("");
      statuspane.add(l2);
      l2.set({
        backgroundColor : "#C1ECFF"
      });
      this.widgets["statuspane.number"] = l2;


      statuspane.add((new qx.ui.basic.HorizontalSpacer).set({width:"1*"}));

      // System Info
      statuspane.add(new qx.ui.basic.Label("System Status: "));
      var l3 = new qx.ui.basic.Label("");
      statuspane.add(l3);
      l3.set({
        width : 200
      });
      this.widgets["statuspane.systeminfo"] = l3;
      this.widgets["statuspane.systeminfo"].setText("Loading...");

      return statuspane;
    }, //makeStatus


    // ------------------------------------------------------------------------
    //   EVENT HANDLER
    // ------------------------------------------------------------------------

    treeGetSelection : function (e) {
      if (! this.tree.getSelectedElement()) {// this is a kludge!
        return; }
      var treeNode    = this.tree.getSelectedElement();
      var modelNode   = treeNode.getUserData("modelLink");
      this.tests.selected = this.tests.handler.getFullName(modelNode);
      // update status pane
      this.widgets["statuspane.current"].setText(this.tests.selected);
      this.tests.selected_cnt = this.tests.handler.testCount(modelNode);
      this.widgets["statuspane.number"].setText(this.tests.selected_cnt+"");
      // update toolbar
      this.widgets["toolbar.runbutton"].resetEnabled();
      // update selection in other tree
      // -- not working!
      var selButt = this.widgets["treeview"].getBar().getManager().getSelected();
      if (selButt.getLabel() == "Full Tree")
      {
        if (modelNode.widgetLinkFlat){
          this.widgets["treeview.flat"].setSelectedElement(modelNode.widgetLinkFlat);
          if (modelNode.widgetLinkFlat instanceof qx.ui.tree.TreeFolder)
          {
            modelNode.widgetLinkFlat.open();
          }
        } else
        {
          this.widgets["treeview.flat"].getManager().deselectAll();
        }
      } else
      {
        this.widgets["treeview.full"].setSelectedElement(modelNode.widgetLinkFull);
        if (modelNode.widgetLinkFull instanceof qx.ui.tree.TreeFolder)
        {
          modelNode.widgetLinkFull.open();
        }
      }

      this.widgets["statuspane.systeminfo"].setText("Tests selected");

    }, //treeGetSelection


    // -------------------------------------------------------------------------

    leftReloadTree : function (e) {  // use tree struct

      /**
       * create widget tree from model
       *
       * @param widgetR {qx.ui.tree.Tree}    [In/Out]
       *        widget root under which the widget tree will be built
       * @param modelR  {testrunner.runner.Tree} [In]
       *        model root for the tree from which the widgets representation
       *        will be built
       */
      function buildSubTree (widgetR, modelR)
      {
        var children = modelR.getChildren();
        var t;
        for (var i=0; i<children.length; i++)
        {
          var currNode = children[i];
          if (currNode.hasChildren())
          {
            t = new qx.ui.tree.TreeFolder(currNode.label,"testrunner/image/package18.gif");
            buildSubTree(t,currNode);
          } else
          {
            t = new qx.ui.tree.TreeFile(currNode.label,"testrunner/image/class18.gif");
          }
          // make connections
          widgetR.add(t);
          t.setUserData("modelLink", currNode);
          currNode.widgetLinkFull = t;
          if (that.tests.handler.getFullName(currNode) == that.tests.selected)
          {
            selectedElement = currNode;
          }
        }

      }; //buildSubTree;


      function buildSubTreeFlat (widgetR, modelR)
      {
        var iter = modelR.getIterator("depth");
        var currNode;
        while (currNode = iter())
        {
          if (currNode.type && currNode.type == "test")
            ;
          else  // it's a container
          {
            if (handler.hasTests(currNode)) {
              var fullName = handler.getFullName(currNode);
              var t = new qx.ui.tree.TreeFolder(fullName,"testrunner/image/package18.gif");
              widgetR.add(t);
              t.setUserData("modelLink", currNode);
              currNode.widgetLinkFlat = t;
              if (that.tests.handler.getFullName(currNode) == that.tests.selected)
              {
                selectedElement = currNode;
              }
              var children = currNode.getChildren();
              for (var i=0; i<children.length; i++)
              {
                if (children[i].type && children[i].type == "test")
                {
                  var c = new qx.ui.tree.TreeFile(children[i].label,"testrunner/image/class18.gif");
                  t.add(c);
                  c.setUserData("modelLink", children[i]);
                  children[i].widgetLinkFlat = c;
                  if (that.tests.handler.getFullName(children[i]) == that.tests.selected)
                  {
                    selectedElement = children[i];
                  }
                }
              }
            }
          }
        }
      }; //buildSubTreeFlat

      // -- Main --------------------------------

      var ttree   = this.tests.handler.ttree;
      var handler = this.tests.handler;
      var that    = this;

      // Reset Status Pane Elements
      this.widgets["statuspane.current"].setText("");
      this.widgets["statuspane.number"].setText("");

      // Disable Tree View
      this.widgets["treeview"].setEnabled(false);

      // Handle current Tree Selection and Content
      var fulltree = this.widgets["treeview.full"];
      var flattree = this.widgets["treeview.flat"];
      var trees    = [fulltree, flattree];
      var stree    = this.widgets["treeview"].getBar().getManager().getSelected();

      for (var i=0; i<trees.length; i++)
      {
        trees[i].resetSelected();
        trees[i].destroyContent(); // clean up before re-build
        trees[i].setUserData("modelLink", ttree); // link top level widgets and model
      }
      // link top level model to widgets
      ttree.widgetLinkFull = fulltree;
      ttree.widgetLinkFlat = flattree;

      var selectedElement = null; // if selection exists will be set by
                                  // buildSubTree* functions to a model node
      // Build the widget trees
      buildSubTree(this.widgets["treeview.full"],ttree);
      buildSubTreeFlat(this.widgets["treeview.flat"],ttree);

      // Re-enable and Re-select
      this.widgets["treeview"].setEnabled(true);
      if (selectedElement)  // try to re-select previously selected element
      {
        // select tree element and open if folder
        if (selectedElement.widgetLinkFull) {
          this.widgets["treeview.full"].setSelectedElement(selectedElement.widgetLinkFull);
          if (selectedElement.widgetLinkFull instanceof qx.ui.tree.TreeFolder)  {
            selectedElement.widgetLinkFull.open();
          }
        }
        if (selectedElement.widgetLinkFlat) {
          this.widgets["treeview.flat"].setSelectedElement(selectedElement.widgetLinkFlat);
          if (selectedElement.widgetLinkFlat instanceof qx.ui.tree.TreeFolder) {
            selectedElement.widgetLinkFlat.open();
          }
        }
      }

    }, //leftReloadTree


    // -------------------------------------------------------------------------
    /**
     * event handler for the Run Test button - performs the tests
     */
    runTest : function (e)
    {

      // -- Vars and Setup -----------------------

      this.toolbar.setEnabled(false);
      //this.tree.setEnabled(false);
      this.widgets["statuspane.systeminfo"].setText("Preparing...");

      this.resetGui();
      var bar = this.widgets["progresspane.progressbar"];
      // Make initial entry in output windows (test result, log, ...)
      this.appender("Now running: " + this.tests.selected);

      var tstCnt = this.tests.selected_cnt;
      var tstCurr = 1;
      var testResult;

      // start test

      // Currently, a flat list of individual tests is computed (buildList), and
      // then processed by a recursive Timer.once-controlled funtion (runtest);
      // each test is passed to the same iframe object to be run(loader.runTests).

      var that    = this;
      var tlist   = [];
      var tlist1  = [];
      var handler = this.tests.handler;

      // -- Helper Functions ---------------------

      // create testResult obj
      function init_testResult () {
        var testResult = new that.frameWindow.testrunner.TestResult();

        // set up event listeners
        testResult.addEventListener("startTest", function(e)
        {
          var test = e.getData();
          that.currentTestData = new testrunner.runner.TestResultData(test.getFullName());
          that.f1.addTestResult(that.currentTestData);
          that.appender("Test '"+test.getFullName()+"' started.");
        }, that);

        testResult.addEventListener("failure", function(e)
        {
          var ex = e.getData().exception;
          var test = e.getData().test;
          that.currentTestData.setException(ex);
          that.currentTestData.setState("failure");
          bar.setBarColor("#9d1111");
          var val = that.getFailCnt();
          that.setFailCnt(++val);
          that.appender("Test '"+test.getFullName()+"' failed: " +  ex.getMessage() + " - " + ex.getComment());
          that.widgets["progresspane.progressbar"].update(String(tstCurr+"/"+tstCnt));
          tstCurr++;
        }, that);

        testResult.addEventListener("error", function(e)
        {
          var ex = e.getData().exception;
          that.currentTestData.setException(ex);
          that.currentTestData.setState("error");
          bar.setBarColor("#9d1111");
          var val = that.getFailCnt();
          that.setFailCnt(++val);
          that.appender("The test '"+e.getData().test.getFullName()+"' had an error: " + ex, ex);
          that.widgets["progresspane.progressbar"].update(String(tstCurr+"/"+tstCnt));
          tstCurr++;
        }, that);

        testResult.addEventListener("endTest", function(e)
        {
          var state = that.currentTestData.getState();
          if (state == "start") {
            that.currentTestData.setState("success");
            //that.widgets["progresspane.succ_cnt"].setText(++that.tests.succ_cnt+"");
            var val = that.getSuccCnt();
            that.setSuccCnt(++val);
            that.widgets["progresspane.progressbar"].update(String(tstCurr+"/"+tstCnt));
            tstCurr++;
          }
        }, that);

        return testResult;
      }; //init_testResult

      /*
       * function to process a list of individual tests
       * because of Timer.once restrictions, using an external var as parameter
       * (tlist)
       */
      function runtest()
      {
        that.widgets["statuspane.systeminfo"].setText("Running tests");
        that.toolbar.setEnabled(false); //if we are run as run_pending
        if (tlist.length) {
          var test = tlist[0];
          that.loader.runTests(testResult, test[0], test[1]);
          tlist = tlist.slice(1,tlist.length);  // recurse with rest of list
          qx.client.Timer.once(runtest,this,100);
        } else { // no more tests -> re-enable toolbar
          that.toolbar.setEnabled(true);
          //that.tree.setEnabled(true);
          that.widgets["statuspane.systeminfo"].setText("Ready");
        }
      };


      /**
       * build up a list that will be used by runtest() as input (var tlist)
      */
      function buildList(node) // node is a modelNode
      {
        var tlist = [];
        var path = handler.getPath(node);
        var tclass = path.join(".");

        if (node.hasChildren()) {
          var children = node.getChildren();
          for (var i=0; i<children.length; i++)
          {
            if (children[i].hasChildren()){
              tlist = tlist.concat(buildList(children[i]));
            } else {
              tlist.push([tclass, children[i].label]);
            }
          }
        } else {
          tlist.push([tclass, node.label]);
        }
        return tlist;
      }; //buildList


      // -- Main ---------------------------------

      // get model node from selected tree node
      var widgetNode = this.tree.getSelectedElement();
      if (widgetNode) {
        var modelNode  = widgetNode.getUserData("modelLink");
      } else
      { // no selected tree node - this should never happen here!
        alert("Please select a test node from the tree!");
        return;
      }
      // build list of individual tests to perform
      tlist = buildList(modelNode);
      if (this.reloadswitch.getChecked()) {
        // set up pending tests
        this.tests.run_pending = function ()
        {
          testResult = init_testResult();
          if (!testResult) {
            that.debug("Alarm: no testResult!");}
          else {
            runtest();}
        };
        this.reloadTestSuite();
      } else {
        // run the tests now
        testResult = init_testResult();
        runtest();
      }

    }, //runTest


    // -------------------------------------------------------------------------
    /**
     * reloads iframe's URL
     */
    reloadTestSuite : function (e)
    {
      var curr = this.iframe.getSource();
      var neu  = this.testSuiteUrl.getValue();
      this.toolbar.setEnabled(false);
      this.widgets["statuspane.systeminfo"].setText("Reloading test suite");
      // reset status information
      this.resetGui();
      qx.client.Timer.once(function () {
        if (curr == neu) {
          this.iframe.reload();
        } else {
          this.iframe.setSource(neu);
        }
      },this,0);
    }, //reloadTestSuite


    ehIframeOnLoad : function (e) {
      var iframe = this.iframe;

      this.frameWindow = iframe.getContentWindow();

      if (
        !this.frameWindow ||
        !this.frameWindow.testrunner ||
        !this.frameWindow.testrunner.TestLoader ||
        !this.frameWindow.testrunner.TestLoader.getInstance()
      ) { // wait for the iframe to load
        qx.client.Timer.once(arguments.callee, this, 50);
        return;
      }

      this.loader = this.frameWindow.testrunner.TestLoader.getInstance();
      var testRep = this.loader.getTestDescriptions();
      this.tests.handler = new testrunner.runner.TestHandler(testRep);
      this.leftReloadTree();
      this.toolbar.setEnabled(true);  // in case it was disabled (for reload)
      if (this.tests.run_pending) {   // do we have pending tests to run?
        this.tests.run_pending();
        delete this.tests.run_pending;
      }
      this.widgets["statuspane.systeminfo"].setText("Ready");
    },


    // ------------------------------------------------------------------------
    //   MISC HELPERS
    // ------------------------------------------------------------------------

    resetGui : function ()
    {
      this.resetProgress();
      this.resetTabView();
    },


    resetProgress : function ()
    {
      var bar = this.widgets["progresspane.progressbar"];
      bar.reset();
      bar.setBarColor("#36a618");
      this.setSuccCnt(0);
      this.setFailCnt(0);
    },


    resetTabView : function ()
    {
      this.f1.clear();
    },


    _applySuccCnt : function (newSucc)
    {
      this.widgets["progresspane.succ_cnt"].setText(newSucc+"");
    },


    _applyFailCnt : function (newFail)
    {
      this.widgets["progresspane.fail_cnt"].setText(newFail+"");
    },


    appender : function (str) {
      //this.f1.setValue(this.f1.getValue() + str);
      //this.f1.setHtml(this.f1.getHtml()+"<br>"+str);
    } //appender


  } //members

});


