//React から useState フックをインポート
import React, { useState } from 'react';

type Todo = {
  value: string;
  readonly id: number;
  //完了/未完了を示すプロパティ
  checked: boolean;
}

export const App = () => {
  /**
   * text = ステートの値
   * setText = ステートの値を更新するメソッド
   * useState の引数 = ステートの初期値 (=空の文字列)
   */
  const [text, setText] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);

  //todos ステートを更新する関数
  const handleOnSubmit = ( ) => {
    //何も入力されていなかったらリターン
    if(!text) return;

    //新しい Todo を作成
    const newTodo: Todo = {
      value: text,
      /**
       * Todo 型オブジェクトの型定義が更新されたため、
       * number 型のid プロパティの存在が必須になった
       */
      id: new Date().getTime(),
      //初期値（todo 作成時）は false
      checked: false,
    };

    /**
     * スプレッド構文を用いて todos ステートのコピーへ newTodo を追加する
     * 以下と同義
     * 
     * const oldTodos = todos.slice();
     * oldTodos.unshift(newTodo);
     * setTodos(oldTodos);
     * 
     **/
    setTodos([newTodo, ...todos]);
    //フォームへの入力をクリアする
    setText('');
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
    setText(e.target.value);
  };

  const handleOnEdit = (id: number, value: string) => {
    /**
     * ディープコピー:
     * 同じく Array.map() を利用するが、それぞれの要素をスプレッド構文で
     * いったんコピーし、それらのコピー(= Todo 型オブジェクト) を要素とする
     * 新しい配列を再編成する。
     * 
     * 以下と同義
     * const deepCopy = todos.map((todo) => ({
     *    value: todo.value,
     *    id: todo.id,
     * }))
     */
    const deepCopy = todos.map((todo) => ({ ...todo}));

    //ディープコピーされた配列に Array.map() を適用
    const newTodos = deepCopy.map((todo) => {
      if (todo.id === id) {
        todo.value = value;
      }
      return todo;
    });
    
    // todos ステート配列をチェック（後でコメントアウト）
    //console.log('=== original todos ===');
    //todos.map((todo) => console.log(`id: ${todo.id}, value: ${todo.value}`));

    setTodos(newTodos);
  };

  const handleOnCheck = (id: number, checked: boolean) => {
    const deepCopy = todos.map((todo) => ({ ...todo}));

    const newTodos = deepCopy.map((todo) => {
      if (todo.id === id) {
        todo.checked = !checked;
      }
      return todo;
    });

    setTodos(newTodos);
  };

  return (
    <div>
      {/* コールバックとして () => handleOnsubmit() を渡す*/}
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        handleOnSubmit();
      }}
      >
        {/*
        入力中テキストの値を text ステートが
        持っているのでそれを value として表示
        
        onChange イベント (=入力テキストの変化)を
        text ステートに反映する
        */}
        <input 
          type="text" 
          value={text} 
          onChange={(e) => handleOnChange(e)} 
        />
        {/* 上に同じ */}
        <input
          type="submit"
          value="追加"
          onSubmit={handleOnSubmit}
        />
      </form>
      <ul>
        {todos.map((todo) => {
          return (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.checked}
              onChange={() => handleOnCheck(todo.id, todo.checked)}
            />
            <input
              type="text"
              disabled={todo.checked}
              value={todo.value}
              onChange={(e) => handleOnEdit(todo.id, e.target.value)}
            />
          </li>
        );
        })}
      </ul>
    </div>
  );
};