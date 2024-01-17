const Book = require('../models/Book')

const prepareQueryField = (fieldValue) => {
    return fieldValue.toLocaleLowerCase()
        .replace(/i/gi, '[iİ]')
        .replace(/ı/gi, '[ıI]');
};

const getAllBooks = async (req, res) => {
    try {
        // İstemciden gelen sorgu parametrelerini çözümlemek
        const { author, title, sort, fields, numericFilters } = req.query;
        const queryObj = {}; // MongoDB sorgusu oluşturmak için kullanılacak nesne

        // Eğer 'author' varsa, sorgu objesine eklemek
        if (author) {
            queryObj.author = { $regex: prepareQueryField(author), $options: 'i' };
        }

        // Eğer 'title' varsa, sorgu objesine ekle
        if (title) {
            queryObj.title = { $regex: prepareQueryField(title), $options: 'i' };
        }

        // Eğer 'numericFilters' varsa, sayısal filtreleri işle
        if (numericFilters) {
            const operatorMap = {
                '>': '$gt',
                '>=': '$gte',
                '=': '$eq',
                '<': '$lt',
                '<=': '$lte',
            };

            const regEx = /\b(<|>|>=|=|<|<=)\b/g;
            let filters = numericFilters.replace(regEx, match => `-${operatorMap[match]}-`);

            const options = ['price', 'stock'];

            filters.split(',').forEach(item => {
                const [field, operator, value] = item.split('-');
                // Eğer alan geçerli ise, sorgu objesine ekle
                if (options.includes(field)) {
                    queryObj[field] = { [operator]: Number(value) };
                }
            });
        }

        // MongoDB sorgusunu oluşturun
        let result = Book.find(queryObj);

        // Eğer 'sort' varsa, sıralamayı uygula
        if (sort) {
            const sortList = sort.split(',').join(' ');
            result = result.sort(sortList);
        } else {
            // Eğer sıralama belirtilmemişse, varsayılan olarak 'createdAt' kullan
            result = result.sort('createdAt');
        }

        // Eğer 'fields' varsa, belirtilen alanları seç
        if (fields) {
            const fieldsList = fields.split(',').join(' ');
            result = result.select(fieldsList);
        }

        // Sayfalama için gerekli olan 'page' ve 'limit' parametrelerini al
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Sorguyu düzenleyin ve sonuçları al
        result = result.skip(skip).limit(limit);
        const books = await result;

        // İstemciye başarı mesajı ve kitapları dön
        return res.status(200).json({ message: 'Başarılı', data: books, count: books.length });
    } catch (error) {
        // Hata olması durumunda hata mesajını ve 500 (Dahili Sunucu Hatası) durum kodunu döndür
        console.error('Error:', error);
        return res.status(500).json({ message: 'Dahili Sunucu Hatası!' });
    }
};


const getBook = async (req, res) => {

    const id = req.params.id

    const book = await Book.findById(id)
    if (!book) {
        return res.status(404).send({ message: "Kitap bulunamadı" })
    }

    return res.status(201).send({ message: "Başarılı", data: book })

}

const addBooks = async (req, res) => {
    const booksData = req.body; // İstekten gelen kitap verileri (bir dizi olarak bekleniyor)

    // Kitapları MongoDB'ye ekleyin
    Book.insertMany(booksData)
        .then(insertedBooks => {
            res.status(201).json({ message: 'Kitaplar başarıyla eklendi', data: insertedBooks });
        })
        .catch(error => {
            console.error('Kitap ekleme hatası:', error);
            res.status(500).json({ message: 'Dahili Sunucu Hatası' });
        });
};


const addBook = (req, res) => {
    const newBook = {
        title: req.body.title,
        author: req.body.author,
        publishYear: req.body.publishYear,
        description: req.body.description,
        category: req.body.category,
        language: req.body.category,
        publicationDate: req.body.publicationDate,
        edition: req.body.edition,
        placeOfPublication: req.body.placeOfPublication,
        width: req.body.width,
        height: req.body.height,
        pageCount: req.body.pageCount,
        coverType: req.body.coverType,
        paperType: req.body.paperType,
        barcode: req.body.barcode,
        stock: req.body.stock,
        price: req.body.price
    };

    Book.create(newBook)
        .then(book => {
            res.status(201).send({ message: "Başarılı", data: book });
        })
        .catch(error => {
            console.error('Kitap ekleme hatası:', error);
            res.status(500).json({ message: 'Dahili Sunucu Hatası' });
        });
};



const updateBook = async (req, res) => {

    const { id } = req.params

    const book = await Book.findByIdAndUpdate(id, req.body, { new: true, runValidators: true})

    if (!book) {
        return res.status(404).send({ message: "Kitap bulunamadı" })
    }

    return res.status(201).send({ message: "Başarılı", data: book })

}

// Örnek ürün dizisi
const products = [];

// Ürünleri tek seferde MongoDB'ye ekleyen fonksiyon
const addProductsToMongoDB = async () => {
    try {
        // insertMany metodu ile ürünleri MongoDB'ye ekleyin
        const result = await Book.insertMany(products);
        
        // Başarı durumunda bilgi mesajını yazdırın
        console.log(`${result.length} ürün başarıyla eklendi.`);
    } catch (error) {
        // Hata durumunda hatayı konsola yazdırın
        console.error('Ürün ekleme hatası:', error);
    }
};


const deleteBook = async (req, res) => {

    const { id } = req.params

    const book = await Book.findByIdAndDelete(id)
    if (!book) {
        return res.status(404).send({ message: "Kitap bulunamadı" })
    }
    return res.status(201).send({ message: "Başarılı", data: book })

}

module.exports = { getAllBooks, getBook, addBook, addBooks, updateBook, deleteBook }