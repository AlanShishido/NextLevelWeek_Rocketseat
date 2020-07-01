function populateUFs(){
  //pegar as propriedades do UF do site do ibge a partir do JSON
  const ufSelect = document.querySelector("select[name=uf]")

  fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
  .then((res)=>{return res.json()}) //pode ser escrito apenas res => res.json()
  .then(states => {
    for(const state of states){
      ufSelect.innerHTML += `<option value ="${state.id}">${state.nome}</option>`
    }
  })
}

populateUFs()

function getCities(event){
  const citySelect = document.querySelector("select[name=city]")
  const stateInput = document.querySelector("input[name=state]")

  const ufValue = event.target.value

  stateInput.value = event.target.options[event.target.selectedIndex].text

  const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

  citySelect.innerHTML ="<option value>Selecione a cidade</option>"
  citySelect.disabled = true

  fetch(url)
  .then((res)=>{return res.json()})
  .then(cities => {
    for(const city of cities){
      citySelect.innerHTML += `<option value ="${city.nome}">${city.nome}</option>`
    }
    citySelect.disabled = false;
  })
}

document
  .querySelector("select[name=uf]") //procurou o elemente do nome uf
  .addEventListener("change", getCities)
//() => {} significa função anoniva que é o mesmo de function()

//itens de coleta
//pegar todos os li's
const itensToCollect = document.querySelectorAll(".itens-grid li")
for (const item of itensToCollect){
  item.addEventListener("click",handleSelectedItem)
}

let selectedItems = []

const colectedItems = document.querySelector("input[name=items]")

function handleSelectedItem (event){
  const itemLi = event.target

  //adicionar ou remover uma classe com java script
  itemLi.classList.toggle("selected")

  const itemId = itemLi.dataset.id

  const alreadySelected = selectedItems.findIndex(item => item === itemId)

  if (alreadySelected >= 0) {
    const filteredItems = selectedItems.filter( item => item != itemId)
    selectedItems = filteredItems
  }

  else{
    selectedItems.push(itemId)
  }

  // console.log(selectedItems)
  colectedItems.value = selectedItems
}
