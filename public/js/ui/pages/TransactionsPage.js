/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if ( !element ) {
      throw new Error ("element doesn't exist");
    }

    this.element = element;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    document.querySelector(".remove-account").addEventListener( "click", () => this.removeAccount() );

    this.element.querySelectorAll(".transaction__remove").forEach( elem => elem.addEventListener("click", () => this.removeTransaction(`${this.element.dataset.id}`)) );
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (this.lastOptions) {

      if (confirm("Вы согласны удалить счёт?")) {
        Account.remove(options.account_id, (err, response) => {
          if ( response && response.success ) {
            App.updateWidgets();
            App.updateForms();
          }
        })
      }

      this.clear();
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    if (confirm("Вы действительно хотите удалить эту транзакцию?")) {
      Transaction.remove(id, (err, response) => {
        if ( response && response.success ) {
          App.update();
          // this.update();
          // AccountsWidget.update();
        }
      })
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {    //  ???
    if ( options ) {
      this.lastOptions = options;

      Account.get(options.account_id, (err, response) => {
        if ( response && response.success) {
          this.renderTitle(response.data.name);
        }
      })
      Thansaction.list(options, (err, response) => {
        if ( response && response.success ) {
          this.renderTransactions(response.data);
        }
      })
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle("Название счёта");
    this.lastOptions = null;  //  ???
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    this.element.querySelector(".content-title").textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    let formatterDate = new Date(date);
    const resultDate = formatterDate.toLocaleTimeString("ru", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric"
    })

    return resultDate;

    // let day = date.split(" ")[0].split("-");
    // let time = date.split(" ")[1].split(":");
    // let months = ["января", "февраля", "марта", "апреля", 'мая', "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    // let resultDate = `${day[2]} ${months[day[1] - 1]} ${day[0]} г. в ${time[0]}:${time[1]}`;
    // return resultDate;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    `<div class="transaction transaction_${item.type} row">
      <div class="col-md-7 transaction__details">
        <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
        </div>
        <div class="transaction__info">
          <h4 class="transaction__title">${item.name}</h4>
          <div class="transaction__date">${this.formatDate(item.created_at)}</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="transaction__summ">
          ${item.sum} <span class="currency">₽</span>
        </div>
      </div>
      <div class="col-md-2 transaction__controls">
        <!-- в data-id нужно поместить id -->
        <button class="btn btn-danger transaction__remove" data-id=${item.id}>
          <i class="fa fa-trash"></i>  
        </button>
      </div>
    </div>`
  };

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    data.forEach( pos => document.querySelector(".content").insertAdjacentHTML("beforeend", this.getTransactionHTML(pos)) );
  }
}