import {
    AppstoreOutlined,
} from "@ant-design/icons";

import {
    Select,
} from "antd";

import {
    useState,
} from "react";

import CrudManager from "@/components/dashboard/CrudManager";

import type {
    CrudField,
} from "@/components/dashboard/CrudManager";

import {
    CATALOG_DEFS,
} from "@/config/catalogs";

import type {
    CatalogRecord,
} from "@/store/useCatalog";

import {
    useCatalogOptions,
} from "@/store/useCatalog";

import "./style.scss";


const catalogSelectOptions =
    CATALOG_DEFS.map(
        (catalog) => ({
            value: catalog.key,
            label: catalog.title,
        }),
    );


const catalogFields:
    CrudField<CatalogRecord>[] = [
        {
            name: "label",
            label: "Tên hiển thị",
            required: true,
            placeholder:
                "Nhập tên hiển thị trong danh sách",
            tableWidth: 220,
        },
        {
            name: "value",
            label: "Giá trị (mã)",
            required: true,
            placeholder:
                "Nhập mã ổn định (không thay đổi khi nhập/xuất dữ liệu)",
            tableWidth: 180,
        },
    ];


const CatalogsPage = () => {
    const [
        catalogKey,
        setCatalogKey,
    ] =
        useState(
            CATALOG_DEFS[0].key,
        );

    const catalog =
        CATALOG_DEFS.find(
            (item) =>
                item.key ===
                catalogKey,
        ) ?? CATALOG_DEFS[0];

    const options =
        useCatalogOptions(
            catalog.key,
        );

    return (
        <div className="catalog-page">
            <header className="page-head">
                <div className="page-head__inner">
                    <span className="page-head__eyebrow">
                        DANH MỤC DÙNG CHUNG
                    </span>

                    <h2>Quản lý danh mục</h2>

                    <p>
                        Các danh mục dùng chung cung cấp dữ liệu cho danh
                        sách và biểu mẫu của toàn hệ thống. Sửa tại đây,
                        các cột danh sách sẽ hiển thị lại ngay theo danh mục.
                    </p>
                </div>
            </header>

            <div className="catalog-page__toolbar">
                <Select
                    value={catalog.key}
                    onChange={setCatalogKey}
                    options={catalogSelectOptions}
                    className="catalog-page__select"
                />

                <span className="catalog-page__hint">
                    {catalog.description}
                </span>
            </div>

            <CrudManager<CatalogRecord>
                eyebrow={`DANH MỤC · ${catalog.title.toUpperCase()}`}
                title={catalog.title}
                description={catalog.description}
                storageKey={catalog.storageKey}
                seed={catalog.seed.map((option, index) => ({
                    id: String(option.value ?? index),
                    ...option,
                }))}
                fields={catalogFields}
                entityName={catalog.title.toLowerCase()}
                newLabel={`Thêm ${catalog.title.toLowerCase()}`}
                kpis={[
                    {
                        title: "Số mục trong danh mục",
                        value: options.length,
                        icon: <AppstoreOutlined />,
                        tone: "blue",
                        note: catalog.title,
                    },
                ]}
            />
        </div>
    );
};


export default CatalogsPage;