import { Component, OnInit, ViewEncapsulation, KeyValueDiffers, DoCheck, ElementRef, ViewChild } from '@angular/core';
import { GlobalService, TemplateService, LocatorService } from '@core/services';

@Component({
    selector: 'app-search-api',
    templateUrl: './search-api.component.html',
    styleUrls: ['./search-api.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SearchApiComponent implements OnInit, DoCheck {
    @ViewChild('selectedOption') selectedOption: ElementRef;
    @ViewChild('dynamicTitle') dynamicTitle: ElementRef;
    posts: any [] = [];
    getOptions: any[] = [];
    pages: any[] = [];
    locator: any[] = [];
    selected: boolean = false;
    title: any;
    locatorTitle: string = '';
    differ: any;

    constructor(
        private differs: KeyValueDiffers,
        private templateService: TemplateService,
        private locatorService: LocatorService,
        private globalService: GlobalService
    ) {
        // this.differ = this.differs.find({}).create();
    }

    // http://localhost:4200/components/searchapi
    ngDoCheck() {
        // const change = this.differ.diff(this);
        // if (change) {
        //   change.forEachChangedItem(item => {
        //     console.log('item changed', item);
        //   });
        // }
    }

    ngOnInit() {
        this.globalService.changeGoal('Search API');
    }

    getSearch() {
        this.templateService.updateTemplate(this.title);
        this.templateService.getLinks().subscribe((posts: any) => {
            this.getOptions = posts;
        });
    }

    setLocatorEditable() {
        console.log('click')
        this.templateService.getPage().subscribe((pages: any) => {
            console.log(pages.content)
            this.pages = pages.content
        });
    }

    editSelected(text) {
        if (text.includes('{{ui-locator}}')) {
            text = text.replace('{{ui-locator}}', `<span id="ui-locator"> ` + `{{locatorTitle}}` + `</span>`);

            console.log(text);
        }
        return '<p>' + text + '</p>';
    }

    onSelect(title) {
        this.getOptions = [];
        this.selected = true;
        this.locatorTitle = 'uiLocator';
        const divideStr = title.split('{{ui-locator}}')
        console.log(divideStr, title)
        console.log(this.selectedOption)
        this.selectedOption.nativeElement.insertAdjacentHTML('beforebegin', divideStr[0])
        this.selectedOption.nativeElement.insertAdjacentHTML('afterend', divideStr[1])
        this.getOptions = [];
    }

    onSelectPage(page) {
        console.log(page)
        this.locatorTitle = page.pageName
        this.pages = []
        this.locatorService.getLocatorById(page.pageId).subscribe((locator: any) => {
            console.log(locator)
            this.locator = locator.content
        });
    }

    onSelectLocator(locator) {
        console.log(locator)
        this.locatorTitle = locator.locatorName
        this.locator = []
        console.log(this.dynamicTitle.nativeElement.innerText, 'hahahah')
    }

    onClick() {
        if (!this.selected) {
            this.posts.push(this.title);
            this.title = '';
        } else {
            this.posts.push(this.dynamicTitle.nativeElement.innerText);
            this.title = '';
            this.locatorTitle = ''
            this.dynamicTitle.nativeElement.value = ''
        }
        this.selected = false;

    }
}
