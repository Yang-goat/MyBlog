---
icon: pen-to-square
date: 2022-01-01
order: 2
category:
  - Java
tag:
  - 基础
---

# Java I/O

Java 的 I/O（输入/输出）主要用于处理文件、网络、控制台输入输出等操作，核心是 `java.io` 和 `java.nio`（非阻塞IO 适用于高并发场景） 两个包。以下结合常见的实用场景，详细讲解 Java IO 的。



## 1. **文件操作：读取和写入文件**

Java IO 中最常见的操作是文件的读取和写入，这里使用字符流，一次读取/写入一个字符。

### **读取文件：**

```java
import java.io.*;

public class FileReadExample {
    public static void main(String[] args) {
        // 文件路径
        String filePath = "example.txt";
        
        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line); // 输出文件内容
            }
        } catch (IOException e) {
            e.printStackTrace(); // 处理异常
        }
    }
}
```

- `FileReader` 用于读取文件字符流。
- `BufferedReader` 提高读取效率，并提供逐行读取的方法。

### **写入文件：**

```java
import java.io.*;

public class FileWriteExample {
    public static void main(String[] args) {
        // 文件路径
        String filePath = "example.txt";
        
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filePath, true))) {
            writer.write("Hello, Java IO!");
            writer.newLine(); // 换行
        } catch (IOException e) {
            e.printStackTrace(); // 处理异常
        }
    }
}
```

- `FileWriter` 用于写入字符数据。
- `BufferedWriter` 提供更高效的写入操作，`newLine()` 插入换行符。
- 第二个参数 `true` 表示追加模式。



## 2. **控制台输入/输出**

通过 `System.in` 和 `System.out` 实现简单交互。

### **读取用户输入：**

```java
import java.util.Scanner;

public class ConsoleInputExample {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("请输入你的名字: ");
        String name = scanner.nextLine(); // 读取一行输入
        System.out.println("你好, " + name + "!");
        scanner.close(); // 关闭 Scanner
    }
}
```

- `Scanner` 是读取用户输入的常用类。
- 提供方法如 `nextInt()`、`nextDouble()`、`nextLine()`。



## 3. **序列化和反序列化**

将对象转换为字节流存储到文件，或从文件还原为对象。

### **序列化：**

```java
import java.io.*;

class Person implements Serializable {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public String toString() {
        return "Person{name='" + name + "', age=" + age + '}';
    }
}

public class SerializationExample {
    public static void main(String[] args) {
        Person person = new Person("Alice", 25);
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("person.dat"))) {
            oos.writeObject(person); // 写入对象
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

### **反序列化：**

```java
import java.io.*;

public class DeserializationExample {
    public static void main(String[] args) {
        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("person.dat"))) {
            Person person = (Person) ois.readObject(); // 读取对象
            System.out.println(person);
        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}
```

- 类需要实现 `Serializable` 接口。
- 确保 `serialVersionUID` 一致性（可选）。



## 4. 二进制I/O

二进制 IO 是通过字节流进行的，它直接操作字节（8 位）。这使得它可以处理任何类型的文件，包括图片、视频、音频或非文本数据的文件。

> 只考这个，其他不考

---

### **核心类**

Java 的二进制 IO 操作基于以下两个接口：

1. **输入流（`InputStream`）：** 从外部输入数据（如从文件、网络等读取数据）。
   - 常用子类：
     - `FileInputStream`：从文件中读取字节数据。
       - 
     - `BufferedInputStream`：为字节流提供缓冲，提升读取效率。
     - `DataInputStream`：读取基本数据类型（`int`、`double` 等）的字节表示。
2. **输出流（`OutputStream`）：** 向外部输出数据（如写入文件）。
   - 常用子类：
     - `FileOutputStream`：向文件写入字节数据。
     - `BufferedOutputStream`：为字节流提供缓冲，提升写入效率。
     - `DataOutputStream`：以二进制形式写入基本数据类型。

-----

### 常见的二进制 IO 操作

#### **1. 读取二进制文件**

读取文件的所有字节内容：

```java
import java.io.*;

public class BinaryFileRead {
    public static void main(String[] args) {
        String filePath = "example.dat";
        try (FileInputStream fis = new FileInputStream(filePath)) {
            int byteData;
            while ((byteData = fis.read()) != -1) {
                System.out.print(byteData + " "); // 输出字节值
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

- 要点：
  - `FileInputStream` 是直接读取文件的字节流。
  - 每次读取一个字节（`int` 类型，范围 0-255）。
- **`int read()`**
  - 读取下一个字节的数据。
  - 返回读取的字节（0 到 255），若已到文件末尾，返回 `-1`。

------

#### **2. 写入二进制文件**

向文件写入字节数据：

```java
import java.io.*;

public class BinaryFileWrite {
    public static void main(String[] args) {
        String filePath = "example.dat";
        try (FileOutputStream fos = new FileOutputStream(filePath)) {
            fos.write(65); // 写入字节 65（ASCII 对应 'A'）
            fos.write(66); // 写入字节 66（ASCII 对应 'B'）
            fos.write(67); // 写入字节 67（ASCII 对应 'C'）
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

- 要点：
  - `FileOutputStream` 是直接向文件写入字节流。
  - 可以使用 `write(int)` 方法写入单个字节数据。

---

#### **3. 高效读取和写入二进制文件**

使用 `BufferedInputStream` 和 `BufferedOutputStream` 提升效率：

```java
import java.io.*;

public class BufferedBinaryIO {
    public static void main(String[] args) {
        String inputFile = "example.dat";
        String outputFile = "copy.dat";

        try (BufferedInputStream bis = new BufferedInputStream(new FileInputStream(inputFile));
             BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(outputFile))) {

            byte[] buffer = new byte[1024]; // 设置缓冲区
            int bytesRead;
            while ((bytesRead = bis.read(buffer)) != -1) {
                bos.write(buffer, 0, bytesRead); // 写入缓冲区内容
            }
            System.out.println("文件复制完成！");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

- 要点：
  - 使用缓冲区（`byte[] buffer`）可以一次读取/写入多个字节，效率高于逐字节操作。

----

#### **4. 处理基本数据类型**

使用 `DataInputStream` 和 `DataOutputStream` 可以直接读写基本数据类型。

**写入数据：**

```java
import java.io.*;

public class DataOutputExample {
    public static void main(String[] args) {
        String filePath = "data.dat";
        try (DataOutputStream dos = new DataOutputStream(new FileOutputStream(filePath))) {
            dos.writeInt(123);     // 写入整数
            dos.writeDouble(45.67); // 写入浮点数
            dos.writeBoolean(true); // 写入布尔值
            dos.writeUTF("你好");   // 写入字符串（UTF 编码）
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

**读取数据：**

```java
import java.io.*;

public class DataInputExample {
    public static void main(String[] args) {
        String filePath = "data.dat";
        try (DataInputStream dis = new DataInputStream(new FileInputStream(filePath))) {
            int number = dis.readInt();        // 读取整数
            double value = dis.readDouble();  // 读取浮点数
            boolean flag = dis.readBoolean(); // 读取布尔值
            String text = dis.readUTF();      // 读取字符串
            System.out.println("整数: " + number);
            System.out.println("浮点数: " + value);
            System.out.println("布尔值: " + flag);
            System.out.println("字符串: " + text);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

- 要点：
  - `DataOutputStream` 将基本数据类型转换为二进制格式写入。
  - `DataInputStream` 按相应类型读取二进制数据。
  - 需严格遵守数据顺序。

----

#### **5. 随机访问文件**

通过 `RandomAccessFile` 可以对文件的特定位置进行读写：

```java
import java.io.*;

public class RandomAccessExample {
    public static void main(String[] args) {
        String filePath = "random.dat";
        try (RandomAccessFile raf = new RandomAccessFile(filePath, "rw")) {
            raf.writeInt(123);    // 写入整数
            raf.writeDouble(45.67); // 写入浮点数
            raf.seek(0);         // 移动到文件开头
            int number = raf.readInt();
            System.out.println("读取整数: " + number);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

- 要点：
  - 使用 `seek(long position)` 方法跳转到文件的任意位置进行读写。
  - 非常适合处理需要随机访问的大文件。

---

### **常见应用场景**

| 应用场景           | 推荐方式                                        | 示例                       |
| ------------------ | ----------------------------------------------- | -------------------------- |
| **文件复制**       | `BufferedInputStream` 和 `BufferedOutputStream` | 高效处理大文件的二进制复制 |
| **处理基本类型**   | `DataInputStream` 和 `DataOutputStream`         | 保存和读取结构化数据       |
| **随机访问**       | `RandomAccessFile`                              | 修改文件中特定位置的内容   |
| **大文件分块操作** | 缓冲区（`byte[]`）                              | 提高读取和写入效率         |
| **压缩文件流**     | `ZipInputStream` 和 `ZipOutputStream`           | 压缩和解压文件             |

