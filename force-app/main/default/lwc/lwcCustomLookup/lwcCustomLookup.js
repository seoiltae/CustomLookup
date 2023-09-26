import { LightningElement,track,api } from 'lwc';
import searchRecord from '@salesforce/apex/CustomLookupControllerMe.searchQuery';
export default class CustomLookupCmp extends LightningElement {
    @api objectName = 'Contact'; // 오브젝트 네임
    @api iconName = ''; // 아이콘
    @api label =''; // 라벨
    @api searchField = ''
    @api defaultField = ''; // 검색 시 보이는 필드
    @api additionalField = ''; // 검색 시 보이는 추가 필드
    @api searchLimit = ''; // 검색 후 보이는 검색목록 수
    @api targetSortColum = ''; // order by 절 필드
    @api sortCondition =''; // 정렬 기준 (ASC,DESC)
    @api placeholder = '';
    resultData = []; // 검색 결과 목록

    //resultFieldList = []; // 추후 CustomLookup Result 목록의 데이터터
    selectRecord ={}; // 선택한 레코드
    searchText = ''; // 검색 입력정보보
    hasRecords = false; // 검색된 정보가 없을 경우 false
    isSearchLoading = false;
    
    // 입력 문자에 공백 확인
    handleChange(event) {
        const lookupInputContainer = this.template.querySelector('.lookupInputContainer');
            const clsList = lookupInputContainer.classList;
            // trim으로 문자가 전부 공백인 경우 공백제거 후 ''인지 확인 
            if(event.target.value.trim() =='') {
                clsList.remove('slds-is-open');
            } else {
                clsList.add('slds-is-open');
            }
    }

    //Lookup 검색 결과(시작)
    handleSearch(event) {
        this.resultData =[];
        this.isSearchLoading = true;
            // 공백이여도 쿼리조회가 되므로 조건 추가
            if(event.target.value.trim() !='') { 
                this.searchText = event.target.value
                searchRecord({ searchText : this.searchText, 
                        objectName : this.objectName,
                        defaultField : this.defaultField,
                        additionalField : this.additionalField,
                        searchLimit : this.searchLimit,
                        targetSortColum : this.targetSortColum,
                        sortCondition : this.sortCondition,
                        searchField : this.searchField
                        })
                .then((result) => {
                    this.resultData = result;
                    // 검색 결과가 없을 경우
                    this.hasRecords = this.resultData.length == 0 ? false : true;
                })
            
                .catch((error) => {
                    console.log('(error---> ' + JSON.stringify(error));
                });
            }
                
        this.isSearchLoading = false;
    }

    //검색 후 선택한 레코드
    handelSelectedRecord(event) {
        let recId = event.target.getAttribute('data-recid');
        this.selectRecord = this.resultData.find(data => data.id === recId);
        console.log(this.selectRecord, ' <===this.selectRecord');
        this.handelSelectRecordHelper(); // 레코드 선택
        this.lookupCustomEvent(this.selectRecord);
        //this.handleSearchRemove();
    
    }
    // 검색 후 선택 시 검색창 초기화
    handleSearchRemove() {
       this.searchText = '';
       this.selectRecord ={};

       //검색결과 hide
        this.template.querySelector('.lookupInputContainer').classList.remove('slds-is-open');
    }


    // 레코드 선택 시 pill화면 오픈
    handelSelectRecordHelper(){
        //검색결과 hide
        this.template.querySelector('.lookupInputContainer').classList.remove('slds-is-open');

        // 검색창 숨기기
        const searchBoxWrapper = this.template.querySelector('.searchBoxWrapper');
        searchBoxWrapper.classList.remove('slds-show');
        searchBoxWrapper.classList.add('slds-hide');
        
        // pillDiv 보이게
        const pillDiv = this.template.querySelector('.pillDiv');
        pillDiv.classList.remove('slds-hide');
        pillDiv.classList.add('slds-show');     
    }

    // 선택한 레코드 제거
    handleRemove() {
        console.log(' handleRemove')
        this.searchText=''; // 입력값 초기화
        this.selectedRecord = {}; // 선택 레코드 초기화
        this.lookupCustomEvent(undefined);
        // 검색 창 오픈
        const searchBoxWrapper = this.template.querySelector('.searchBoxWrapper');
        searchBoxWrapper.classList.remove('slds-hide');
        searchBoxWrapper.classList.add('slds-show');
        
        // 선택 레코드 hide
        const pillDiv = this.template.querySelector('.pillDiv');
        pillDiv.classList.remove('slds-show');
        pillDiv.classList.add('slds-hide');

    }

     // 선택한 레코드 전달
    lookupCustomEvent(value){    
        const oEvent = new CustomEvent('lookupcustomevent',
        {
            'detail': {selectedRecord: value}
        }
        );
        this.dispatchEvent(oEvent);
    }

}