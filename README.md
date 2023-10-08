# ModuleBaseI2CBus
////

# Лицензия
////

# Описание
<div style = "font-family: 'Open Sans', sans-serif; font-size: 16px; color: #555">

Модуль является глобальным менеджером I2C шин в системе. Он хранит существующие хардверные шины, а также может создавать новые софтверные. Модуль работает в режиме синглтон.

### **Конструктор**
Конструктор не принимает никаких значений, и при создании объекта класса произойдёт разовое занесение в массив существующих в системе шин. Массив содержит объекты с двумя полями: непосредственно объект шины и идентификатор *true/false* об её использовании в системе. Пример объекта массива:
```js
this._I2CBus[] = {
    IDBus: I2C{};
    Used: true;
}
```

### **Поля**
- <mark style="background-color: lightblue">_I2Cbus</mark> - массив-контейнер с I2C шинами;
- <mark style="background-color: lightblue">_pattern</mark> - строка-ключ, для всех объектов шин;
- <mark style="background-color: lightblue">_indexBus</mark> - индекс софтверной шины. Начальный - 10, конкатенацией с полем _pattern составляет имя нового объекта-шины.

### **Методы**
- <mark style="background-color: lightblue">Init()</mark> - заносит в массив-контейнер существующие в системе I2C шины, запускается в конструкторе;
- <mark style="background-color: lightblue">AddBus(_opts)</mark> - создаёт новую софтверную шину и заносит её в массив-контейнер.
Принимает объект *_opts*, содержащий пины и битрейт создаваемой шины. Метод проводит проверку валидности данных. Пример объектра *_opts*:
```js
let _opts = {
    sda: B7;
    sdl: B6;
    bitrate: 115200;
}
```
Метод возвращает объект, содержащий имя шины и объект I2C. Пример:
```js
return {
    NameBus: 'I2C10';
    IDBus: I2C{};
}
```

### **Примеры**
Фрагмент кода для создание софтверной шины:
```js
//Подключение необходимых модулей
const ClassI2CBus = require('ClassBaseI2CBus.min');
const err = require('ModuleAppError.min');
const NumIs = require('ModuleAppMath.min');
     NumIs.is(); //добавить функцию проверки целочисленных чисел в Number

//Создание I2C шины
let I2Cbus = new ClassI2CBus();
let bus = I2Cbus.AddBus({sda: B9, scl: B8, bitrate: 400000}).IDbus;
```
</div>