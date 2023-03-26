/**
 * @class
 * Класс ClassBaseI2CBus реализует базовые операции по созданию общего для проекта
 * хранилища объектов I2C шины.
 * Задачи класса динамически создавать и добавлять в контейнер новый объект I2C шины и предоставлять
 * прикладным классам экземпляры объектов, а также хранить информацию о том - занята данная, конкретная
 * шина или нет.
 * Класс хранит экземпляры предопределенных в Espruino I2C шин (I2C1, I2C2, I2C3),
 * а также создает soft шины I2C. При создании возвращается объект типа I2C шина.
 * Класс реализует паттерн - синглтон, т.е. экземпляр класса может быть только один.
 * 
 * 
 * Для работы класса понадобятся пользовательские типы данных, в том числе для передачи параметров.
 * Далее представлены определения этих типов в соответствии с синтаксисом.
 * 
 * тип для передачи аргументов для генерации I2C объекта
 * @typedef  {Object} ObjectI2CBusParam - тип аргумента метода AddBus
 * @property {Object} sda      1 - порт sda шины I2C, обязательное поле
 * @property {Object} scl      2 - порт scl шины I2C, обязательное поле
 * @property {number} bitrate  3 - скорость шины I2C, обязательное поле
 * Пример объекта с аргументами для генерации I2C объекта:
 * {sda:A0, scl:B2, bitrate:100000}
 * 
 * Тип для хранения сгенерированных объектов-шин I2C в экземпляре класса I2C
 * Фактически это тип поля I2Cbus
 * @typedef  {Object} ObjectI2Ccontainer     - тип контейнер хранящий сгенерированные шины
 * @property {Object} BusObjName             - ДИНАМИЧЕСКИ генерируемый ключ записи объекта
 * 
 * Значение  * ключа представляет собой объект хранящий собственно генерируемую I2C шину а также
 * ряд прикладных характеристик, например используется ли в RUNTIME данная шина или свободна.
 * Имя ключа генерируется на основе паттерна I2Cxx, т.е. итоговые имена могут быть: I2C10, I2C11...I2C19...
 * количество шин не ограничено.
 * Далее представлена структура объекта - значения:
 * {
 *  IDbus: <i2c bus object those - result new I2C()>, //сгенерированный экземпляр шины I2C
 *  Used: true/false //состояние шины используется (true), не используется (false)
 * }
 * В RUNTIME может быть только один экземпляр  класса и он должен называться I2Cbus (!),
 * к этому объекту должны обращаться другие объекты
  */
class ClassBaseI2CBus {
    /**
     * @constructor
     */
    constructor() {
        //реализация паттерна синглтон
        if (this.Instance) {
            return this.Instance;
        } else {
            ClassBaseI2CBus.prototype.Instance = this;
        }

        this.I2Cbus = {}; //контейнер объектов-шин I2C
        this.Pattern = 'I2C'; //базовая часть всех ключей объектов-шин I2C, полное название получается конкатенацией с текущим индексом
        this.IndexBus = 10; //начальный индекс soft шин

        //далее инициализируем контейнер первыми тремя шинами которые предустановлены в Espruino
        let i = 1;
        let StrI2c = 'I2C' + i;
        while (!(eval('typeof '+StrTmp+' === \'undefined\''))) {
            if (eval(StrI2c+' instanceof I2C')) {
                    this.I2Cbus[StrI2c] = {IDbus: StrI2c, Used: false};
                }
            i++;
            StrI2c = 'I2C' + i;
        }       
    }
    /**
     * @method
     * Метод AddBus создает объект экземпляр класса I2C, как soft реализацию I2C шины.
     * Методу передается в качестве аргумента объект с параметрами создаваемой шины.
     * @param {ObjectI2CBusParam}   _opt        1 - объект с параметрами шины I2C
     * @returns {Object}            _retVal     1 - возвращаемый объект вида:
     *                                          { NameBus: //имя созданной шины
     *                                            IDbus:   //объект шины I2C
     *                                          }
     */
    AddBus(_opt) {
        /*проверить переданные параметры шины на валидность*/
        if ((typeof (_opt.sda) === 'undefined') || (typeof (_opt.scl) === 'undefined') || (typeof (_opt.bitrate) === 'undefined')) {
           //throw new ClassAppError();
        }

        if (!(_opt.sda instanceof Pin) || !(_opt.scl instanceof Pin) || !(Number.isInteger(_opt.bitrate))){
           //throw new ClassAppError();
        }

        /*все необходимые для создания шины параметры переданы -> создать и инициализировать новую шину*/
        let bus_name = this.Pattern + this.IndexBus; //полное имя ключа текущей шины
        
        this.I2Cbus[bus_name] = {
            IDbus: new I2C(), //сгенерировать шину
            Used: true //индикатор использования шины в true
        };
        
        this.I2Cbus[bus_name].IDbus.setup(_opt); //инициализировать шину

        ++this.IndexBus; //увеличить индекс шины
        
        return {
                NameBus: bus_name, //имя созданной шины
                
                IDbus:   this.I2Cbus[bus_name].IDbus //объект шина I2C
            };
    }
}

exports = ClassBaseI2CBus; //экспортируем класс, ВНИМАНИЕ - именно класс а не объект!