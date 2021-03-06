// Test multicontainer class
casper.notebook_test(function () {
    index = this.append_cell(
        'from IPython.html import widgets\n' + 
        'from IPython.display import display, clear_output\n' +
        'print("Success")');
    this.execute_cell_then(index);

    // Test tab view
    var multicontainer1_query = '.widget-area .widget-subarea div div.nav-tabs';
    var multicontainer1_index = this.append_cell(
        'multicontainer = widgets.TabWidget()\n' +
        'page1 = widgets.TextWidget()\n' +
        'page2 = widgets.TextWidget()\n' +
        'page3 = widgets.TextWidget()\n' +
        'multicontainer.children = [page1, page2, page3]\n' +
        'display(multicontainer)\n' +
        'multicontainer.selected_index = 0\n' +
        'print("Success")\n');
    this.execute_cell_then(multicontainer1_index, function(index){
        
        this.test.assertEquals(this.get_output_cell(index).text, 'Success\n', 
            'Create multicontainer cell executed with correct output. (1)');

        this.test.assert(this.cell_element_exists(index, 
            '.widget-area .widget-subarea'),
            'Widget subarea exists.');

        this.test.assert(this.cell_element_exists(index, multicontainer1_query),
            'Widget tab list exists.');

        this.test.assert(this.cell_element_exists(index, multicontainer1_query),
            'First widget tab list exists.');

        // JQuery selector is 1 based
        this.click(multicontainer1_query + ' li:nth-child(2) a');
    });

    this.wait_for_idle();

    index = this.append_cell(
        'print(multicontainer.selected_index)\n' +
        'multicontainer.selected_index = 2'); // 0 based
    this.execute_cell_then(index, function(index){
        this.test.assertEquals(this.get_output_cell(index).text, '1\n', // 0 based
            'selected_index property updated with tab change.');

        // JQuery selector is 1 based
        this.test.assert(!this.cell_element_function(multicontainer1_index, multicontainer1_query + ' li:nth-child(1)', 'hasClass', ['active']),
                "Tab 1 is not selected.");
        this.test.assert(!this.cell_element_function(multicontainer1_index, multicontainer1_query + ' li:nth-child(2)', 'hasClass', ['active']),
                "Tab 2 is not selected.");
        this.test.assert(this.cell_element_function(multicontainer1_index, multicontainer1_query + ' li:nth-child(3)', 'hasClass', ['active']),
                "Tab 3 is selected.");
    });

    index = this.append_cell('multicontainer.set_title(1, "hello")\nprint("Success")'); // 0 based
    this.execute_cell_then(index, function(index){
        this.test.assert(this.cell_element_function(multicontainer1_index, multicontainer1_query +
            ' li:nth-child(2) a', 'html') == 'hello',
            'Tab page title set (after display).');
    });

    // Test accordion view
    var multicontainer2_query = '.widget-area .widget-subarea .accordion';
    var multicontainer2_index = this.append_cell(
        'multicontainer = widgets.AccordionWidget()\n' +
        'page1 = widgets.TextWidget()\n' +
        'page2 = widgets.TextWidget()\n' +
        'page3 = widgets.TextWidget()\n' +
        'multicontainer.children = [page1, page2, page3]\n' +
        'multicontainer.set_title(2, "good")\n' +
        'display(multicontainer)\n' +
        'multicontainer.selected_index = 0\n' +
        'print("Success")\n');
    this.execute_cell_then(multicontainer2_index, function(index){

        this.test.assertEquals(this.get_output_cell(index).text, 'Success\n', 
            'Create multicontainer cell executed with correct output. (2)');

        this.test.assert(this.cell_element_exists(index, 
            '.widget-area .widget-subarea'),
            'Widget subarea exists.');

        this.test.assert(this.cell_element_exists(index, multicontainer2_query),
            'Widget accordion exists.');

        this.test.assert(this.cell_element_exists(index, multicontainer2_query + 
            ' .accordion-group:nth-child(1) .accordion-body'),
            'First accordion page exists.');

        // JQuery selector is 1 based
        this.test.assert(this.cell_element_function(index, multicontainer2_query + 
            ' .accordion-group:nth-child(3) .accordion-heading .accordion-toggle', 
            'html')=='good', 'Accordion page title set (before display).');

        // JQuery selector is 1 based
        this.click(multicontainer2_query + ' .accordion-group:nth-child(2) .accordion-heading .accordion-toggle');
    });

    this.wait_for_idle();

    index = this.append_cell('print(multicontainer.selected_index)'); // 0 based
    this.execute_cell_then(index, function(index){
        this.test.assertEquals(this.get_output_cell(index).text, '1\n', // 0 based
            'selected_index property updated with tab change.');
    });
});