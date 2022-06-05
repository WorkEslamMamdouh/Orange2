using System;
using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.AccDtTypes
{
   
    public class A_CCDT_TypesService : IA_CCDT_TypesService
    {
        private readonly IUnitOfWork unitOfWork;

        public A_CCDT_TypesService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }

        public A_CCDT_Types GetById(int id)
        {
            return unitOfWork.Repository<A_CCDT_Types>().GetById(id);
        }
        public List<A_CCDT_Types> GetAll()
        {
            return unitOfWork.Repository<A_CCDT_Types>().GetAll();
        }
      

        public List<A_CCDT_Types> GetAll(Expression<Func<A_CCDT_Types, bool>> predicate)
        {
            return unitOfWork.Repository<A_CCDT_Types>().Get(predicate);
        }

        public A_CCDT_Types Insert(A_CCDT_Types KControl)
        {
            var Control = unitOfWork.Repository<A_CCDT_Types>().Insert(KControl);
            unitOfWork.Save();
            return Control;
        }

        public A_CCDT_Types Update(A_CCDT_Types KControl)
        {
            var Control = unitOfWork.Repository<A_CCDT_Types>().Update(KControl);
            unitOfWork.Save();
            return Control;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<A_CCDT_Types>().Delete(id);
            unitOfWork.Save();
        }
        public void Delete(A_CCDT_Types entity)
        {
            unitOfWork.Repository<A_CCDT_Types>().Delete(entity);
            unitOfWork.Save();
        }
    }

}
