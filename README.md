# Web UI of Telegram bot @kumaximbot

[![Yandex S3](https://github.com/kumaxim/kumaximbot-client/actions/workflows/main.yml/badge.svg)](https://github.com/kumaxim/kumaximbot-client/actions/workflows/main.yml)

Web интерфейс Telegram бота [@kumaximbot](https://t.me/kumaximbot). Использованные технологии:
[TypeScript](https://www.typescriptlang.org/) |
[Vue.js](https://vuejs.org/) |
[Bootstrap](https://getbootstrap.com/) |
[SCSS](https://sass-lang.com/) |
[Tinymce](https://www.tiny.cloud/) |
[Vite](https://vitejs.dev/).

# Демо

Интерфейс: [web-client](https://kumaximbot-ui.website.yandexcloud.net/) |
Telegram bot: [@kumaximbot](https://t.me/kumaximbot) |
OpenAPI схема: [swagger-ui](https://d5djd46lehb5f0u4atqk.apigw.yandexcloud.net/docs)


# Системные требования

- ОС: Debian 11 / 12 или Ubuntu 22.04 / 24.04
- Среда исполнения: Node.js 20.8
- Пакетный менеджер: Yarn Berry 3.8.3 


## Переменные окружения
Скопируйте содержимое [example.env](example.env) в файл `.env` либо добавьте соответсвующее переменные в окружение: 
```shell
# Логин Telegram бота, полученный при регистрации в @BotFather
VITE_TELEGRAM_BOT_USERNAME="<bot-username>"
# URL развернутого API сервера из репозитория https://github.com/kumaxim/kumaximbot-api 
VITE_API_URL="<url>"
```


## Установка и запуск
```shell
yarn install
yarn openapi-sdk
yarn dev
```

После выполнения всех вышеуказанных команд будет запущен локальный сервер, доступный по адресу https://localhost:5173


## Развёртывание
Развертывание приложения осуществляется на инфраструктуре Яндекс облака с использованием следующих сервисов:
[Object storage](https://yandex.cloud/ru/docs/storage/) |
[Identity and Access Management](https://yandex.cloud/ru/docs/iam/).
Их настройка и конфигурация осуществляется при помощи [Terraform](https://www.terraform.io/) и описана в файле [yc.tf](yc.tf).
Для полноты картины, также можно ознакомиться с [файлом](.github/workflows/main.yml) настройки окружения GitHub Actions.

Для того чтобы запустить имеющуюся конфигурацию Terraform, необходимо:
1. Создать сервисный аккаунт в сервисе [Identity and Access Management](https://yandex.cloud/ru/docs/iam/)
2. Установить и выполнить инициализацию утилиты [YC CLI](https://yandex.cloud/ru/docs/cli/quickstart)
3. Установить Terraform и настроить провайдер, в соответствии с [инструкцией](https://yandex.cloud/ru/docs/tutorials/infrastructure-management/terraform-quickstart)
4. Создать авторизованный ключ для сервисного аккаунта: `yc iam key create --service-account-id <id-сервисного-аккаунта> --output key.json`
5. Установить переменные окружения со следующими значениями:
    - `YC_SERVICE_ACCOUNT_KEY_FILE` - путь к файлу с ключом сервисного аккаунта или строка с его содержимым
    - `YC_CLOUD_ID` - идентификатор облака
    - `YC_FOLDER_ID` - идентификатор каталога
6. Назначить сервисному аккаунту следующие права на каталог:
    - `storage.editor`
    - `iam.serviceAccounts.user`
    - `iam.serviceAccounts.accessKeyAdmin`
7. Настроить backend для хранения состояний Terraform:
    - Создать s3 backet
    - Создать сервисный аккаунт и статический ключ доступа для него
    - Назначить сервисный аккаунт на s3 backet с ролью `storage.editor`
    - Добавить переменные окружения со следующими значениями:
        - `YC_BACKEND_ACCESS_KEY` - идентификатор ключа
        - `YC_BACKEND_SECRET_KEY` - секретный ключ
    - Инициализировать backend: `terraform init -backend-config="access_key=$YC_BACKEND_ACCESS_KEY" -backend-config="secret_key=$YC_BACKEND_SECRET_KEY"`
8. Установить зависимости проекта: `yarn install`
9. Сгенерировать SDK к API серверу на основе файла [openapi.json](openapi.json): `yarn openapi-sdk`
10. Добавить переменные окружения из [секции](#переменные-окружения) выше с требуемыми значениями
11. Добавить переменную окружения `TF_VAR_SERVICE_ACCOUNT_ID` со значением идентификатора сервисного аккаунта из п.1
12. Запустить сборку проекта: `yarn build`
13. Сгенерировать план выполнения: `terraform plan -out=s3plan`
14. Создать и/или обновить инфраструктуру проекта: `terraform apply s3plan`


## Лицензия

Проект размещен на условиях лицензии MIT


## Автор

Кудрявцев Максим - [kumaxim](https://github.com/kumaxim). 2024 год.